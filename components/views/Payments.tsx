import React, { useEffect, useState } from "react";
import { Box, BoxProps, Button, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";

import StyledCircularProgress from "../common/StyledCircularProgress";
import Layout from "../layout/Layout";

import { AppDispatch, RootState } from "../../store";
import usePaymentTransactions from "../../utils/hooks/useMerkleTransactions";
import useConnectWallet from "../../utils/hooks/useConnectWallet";
import { setLoading } from "../../features/TransactionsSlice";
import { getMerkleProof, generateMerkleTree } from "../../utils/merklePayments";
import { parseTokenValue } from "../../utils/common";
import { PAYMENT_DETAILS } from "../../constants/common";
import { IPaymentDetails } from "../../interfaces/IPayment";

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
  } = usePaymentTransactions();

  const transactionSlice = useSelector(
    (state: RootState) => state.transactions
  );
  const { loading } = transactionSlice;

  const PaymentSlice = useSelector((state: RootState) => state.payments);
  const { pastClaimed, merkleRoot, walletBalance } = PaymentSlice;

  const [PaymentDetails, setPaymentDetails] =
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

    const nextTree = generateMerkleTree(PaymentDetails);
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
      PaymentDetails.payments[account].toString(),
      18
    );
    const proof = getMerkleProof(
      account,
      PaymentDetails.payments[account],
      PaymentDetails
    );

    await checkPastClaim();
    await checkWalletBalance();

    dispatch(setLoading(false));
  };

  useEffect(() => {
    if (account) {
      setupInitial();
    }
  }, [account]);

  return (
    <Layout>
      {/* Show button to connect if not connected */}
      {!account && (
        <StyledBox>
          <InteractButton
            text="Connect"
            method={requestConnect}
            loading={loading}
          />
        </StyledBox>
      )}

      {account && (
        <>
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
              <pre>{JSON.stringify(PaymentDetails, null, 4)}</pre>
            </Typography>
            <Box sx={{ marginBottom: 2 }}>
              <InteractButton
                text="Set New Merkle Root"
                method={handleSetMerkleRoot}
                loading={loading}
              />
              <InteractButton
                text="Reset Merkle Root"
                method={resetMerkleRoot}
                loading={loading}
              />
            </Box>
          </Box>

          <Typography variant="h3">Claimed: {pastClaimed}</Typography>
          {/* Show the merkle root */}
          <Typography variant="h5">Merkle Root: {merkleRoot}</Typography>
          {/* Show current balance */}
          <Typography variant="h5">
            Test USD Balance: {walletBalance}
          </Typography>
          <InteractButton text="Claim" method={handleClaim} loading={loading} />
        </>
      )}
    </Layout>
  );
};

export default Payments;
