import React, { useEffect, useState } from "react";
import {
  Box,
  BoxProps,
  Button,
  Container,
  Link,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";

import StyledCircularProgress from "../common/StyledCircularProgress";
import Layout from "../layout/Layout";
import AlertBar from "../common/AlertBar";

import { AppDispatch, RootState } from "../../store";
import usePaymentTransactions from "../../utils/hooks/useMerkleTransactions";
import useConnectWallet from "../../utils/hooks/useConnectWallet";
import { setLoading, clearError } from "../../features/TransactionsSlice";
import { getMerkleProof, generateMerkleTree } from "../../utils/merklePayments";
import { parseTokenValue } from "../../utils/common";
import { PAYMENT_DETAILS } from "../../constants/common";
import { IPaymentDetails } from "../../interfaces/IPayment";
import { clearError as clearPaymentsError } from "../../features/PaymentsSlice";

const {
  NEXT_PUBLIC_INITIALIZER_ADDRESS = "0x9536fd0322Ab322110C4D0621b46dC936Ee9fCaa",
  NEXT_PUBLIC_FACTORY_ADDRESS = "0xd7906deE9239509EF4564839a25460Bb8F97D2e6",
  NEXT_PUBLIC_CLONE_ADDRESS = "0x60BF7eba37b2A914EcEB8f228c302a1D02aDf6e2",
} = process.env;

const nextPaymentDetails = (): IPaymentDetails => {
  const nextPayment = JSON.parse(JSON.stringify(PAYMENT_DETAILS));
  for (let key of Object.keys(nextPayment.payments)) {
    nextPayment.payments[key] = nextPayment.payments[key] * 2;
  }
  return nextPayment;
};

const StyledBox = styled(Box)<BoxProps>(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  margin: theme.spacing(2, 0),
}));

const InteractButton = (props: {
  text: string;
  method: () => void;
  loading: boolean;
  disabled?: boolean;
}) => {
  const { text, method, loading, disabled = false } = props;
  return (
    <Button variant="outlined" onClick={method} disabled={loading || disabled}>
      {text}
      {loading && <StyledCircularProgress size={24} />}
    </Button>
  );
};

const Payments: React.FunctionComponent = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { account, requestConnect } = useConnectWallet();
  const {
    getMerkleRoot,
    checkPastClaim,
    setNextMerkleRoot,
    checkWalletBalance,
    submitClaim,
  } = usePaymentTransactions();

  const transactionSlice = useSelector(
    (state: RootState) => state.transactions
  );
  const { loading, error } = transactionSlice;

  const PaymentSlice = useSelector((state: RootState) => state.payments);
  const {
    pastClaimed,
    merkleRoot,
    walletBalance,
    error: paymentsError,
  } = PaymentSlice;

  const [paymentDetails, setPaymentDetails] =
    useState<IPaymentDetails>(PAYMENT_DETAILS);

  const setupInitial = async () => {
    dispatch(setLoading(true));

    await getMerkleRoot();
    await checkPastClaim();
    await checkWalletBalance();

    dispatch(setLoading(false));
  };

  const handleSetMerkleRoot = async () => {
    if (!account) return;

    dispatch(setLoading(true));

    const nextTree = generateMerkleTree(paymentDetails);
    const hash = nextTree.getHexRoot();

    await setNextMerkleRoot(hash);

    dispatch(setLoading(false));

    setPaymentDetails(nextPaymentDetails);
  };

  const resetMerkleRoot = async () => {
    if (!account) return;

    dispatch(setLoading(true));

    const nextTree = generateMerkleTree(PAYMENT_DETAILS);
    const hash = nextTree.getHexRoot();

    await setNextMerkleRoot(hash);

    dispatch(setLoading(false));

    setPaymentDetails(PAYMENT_DETAILS);
  };

  const handleClaim = async () => {
    if (!account) return;

    dispatch(setLoading(true));

    const amount = parseTokenValue(
      paymentDetails.payments[account].toString(),
      6
    );
    const proof = getMerkleProof(
      account,
      paymentDetails.payments[account],
      paymentDetails
    );

    await submitClaim(BigInt(Number(amount)), proof);
    await checkPastClaim();
    await checkWalletBalance();

    dispatch(setLoading(false));
  };

  const handleClearAlert = () => {
    if (paymentsError) {
      dispatch(clearPaymentsError());
    } else if (error) {
      dispatch(clearError());
    }
  };

  useEffect(() => {
    if (account) {
      setupInitial();
    }
  }, [account]);

  return (
    <Layout>
      <Container maxWidth="md">
        <Typography variant="h2">Payments</Typography>
        {/* Show JSON file for the Payment details */}
        <Box
          sx={{
            display: "inline-block",
            paddingX: 3,
            border: "1px solid #D3D3D3",
            borderRadius: 5,
            marginBottom: 3,
          }}
        >
          <Typography
            variant="h6"
            sx={{ display: "inline-block", textAlign: "left" }}
          >
            {" "}
            <pre>{JSON.stringify(paymentDetails, null, 4)}</pre>
          </Typography>
          <Box sx={{ marginBottom: 1 }}>
            <InteractButton
              text="Set New Merkle Root*"
              method={handleSetMerkleRoot}
              loading={loading}
            />
            <InteractButton
              text="Reset Merkle Root**"
              method={resetMerkleRoot}
              loading={loading}
            />
          </Box>
          <Box sx={{ margin: 1 }}>
            <Typography variant="body2">
              *Setting new Merkle Root will update the payment amounts, and set
              a new merkle root based on the new details
            </Typography>
            <Typography variant="body2">
              **Resetting the Merkle Root will revert details back to original,
              and reset the merkle root
            </Typography>
          </Box>
        </Box>
        <Typography variant="h3">On-Chain Details</Typography>
        <Box sx={{ margin: "1rem 0" }}>
          <Link
            href={`https://mumbai.polygonscan.com/address/${NEXT_PUBLIC_FACTORY_ADDRESS}#code`}
            target="_blank"
          >
            Factory Contract: ({NEXT_PUBLIC_FACTORY_ADDRESS})
          </Link>
          <Link
            href={`https://mumbai.polygonscan.com/address/${NEXT_PUBLIC_INITIALIZER_ADDRESS}#code`}
            target="_blank"
            sx={{ display: "block" }}
          >
            Initializer Contract ({NEXT_PUBLIC_INITIALIZER_ADDRESS})
          </Link>
          <Link
            href={`https://mumbai.polygonscan.com/address/${NEXT_PUBLIC_CLONE_ADDRESS}#code`}
            target="_blank"
            sx={{ display: "block" }}
          >
            Clone Contract ({NEXT_PUBLIC_CLONE_ADDRESS})
          </Link>
        </Box>
        {/* Show the merkle root */}
        <Typography variant="h5">Merkle Root: {merkleRoot}</Typography>
        <Typography variant="h5">Cumulative Claimed: ${pastClaimed}</Typography>
        {/* Show current balance */}
        <Typography variant="h5">Test USD Balance: ${walletBalance}</Typography>
        <InteractButton text="Claim" method={handleClaim} loading={loading} />

        <AlertBar
          severity="warning"
          text={error || paymentsError}
          handleClearAlertSource={handleClearAlert}
        />
      </Container>
    </Layout>
  );
};

export default Payments;
