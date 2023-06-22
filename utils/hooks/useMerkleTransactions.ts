import { ethers } from "ethers";
import { useDispatch } from "react-redux";

import { AppDispatch } from "../../store";
import useDispatchErrors from "./useDispatchErrors";

import {
  setPastClaimed,
  setMerkleRoot,
  setPeriod,
  setMilestone,
  setWalletBalance,
} from "../../features/PaymentsSlice";
import { formatTokenValue } from "../common";

const MilestonePaymentsInitializableJson = require("../../constants/abis/MilestonePaymentsInitializable.json");
const ERC20ABI = require("../../constants/abis/ERC20-ABI.json");

const NEXT_PUBLIC_CLONE_ADDRESS = process.env.NEXT_PUBLIC_CLONE_ADDRESS;
const NEXT_PUBLIC_TEST_USD_ADDRESS = process.env.NEXT_PUBLIC_TEST_USD_ADDRESS;

const formatValue = (result: any) => {
  const nextResult = BigInt(result).toString();
  const nextValue = formatTokenValue(nextResult, 6);

  return nextValue;
};

const useMilestonePaymentTransactions = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { sendTransactionError, sendTransactionErrorOnMetaMaskRequest } =
    useDispatchErrors();

  const address = NEXT_PUBLIC_CLONE_ADDRESS;

  // Note: Important to run pre-checks before every transaction
  // But may be a bit excessive during initial setup in transaction details
  // Unfortunately, will still require the checking of connection in subsequent transactions
  const runPreChecks = async () => {
    const { ethereum } = window as any;

    if (!window || !ethereum) {
      sendTransactionError("No wallet installed");
      return;
    }

    const provider = new ethers.BrowserProvider(ethereum, "any");

    let walletAddress;

    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      walletAddress = accounts[0]; // first account in MetaMask
    } catch (error: any) {
      sendTransactionErrorOnMetaMaskRequest(error);
      return;
    }

    const { chainId } = await provider.getNetwork();

    if (
      Number(chainId) !==
      parseInt(process.env.NEXT_PUBLIC_NETWORK_CHAIN_ID || "")
    ) {
      sendTransactionError("Please switch to Mumbai network");
      return;
    }

    const signer = await provider.getSigner(walletAddress);

    return { signer };
  };

  const getPeriod = async (): Promise<boolean> => {
    const { signer } = (await runPreChecks()) || {};

    if (!signer) return false;

    const paymentsContract = new ethers.Contract(
      address || "",
      MilestonePaymentsInitializableJson.abi,
      signer
    );

    let result;

    try {
      result = await paymentsContract.period();

      dispatch(setPeriod(Number(result)));
    } catch (error: any) {
      sendTransactionErrorOnMetaMaskRequest(error);
      return false;
    }

    return result;
  };

  const getMilestone = async (): Promise<boolean> => {
    const { signer } = (await runPreChecks()) || {};

    if (!signer) return false;

    const paymentsContract = new ethers.Contract(
      address || "",
      MilestonePaymentsInitializableJson.abi,
      signer
    );

    let result;

    try {
      result = await paymentsContract.milestone();

      dispatch(setMilestone(Number(result)));
    } catch (error: any) {
      sendTransactionErrorOnMetaMaskRequest(error);
      return false;
    }

    return result;
  };

  const getMerkleRoot = async (): Promise<boolean> => {
    const { signer } = (await runPreChecks()) || {};

    if (!signer) return false;

    const paymentsContract = new ethers.Contract(
      address || "",
      MilestonePaymentsInitializableJson.abi,
      signer
    );

    let result;

    try {
      result = await paymentsContract.merkleRoot();

      dispatch(setMerkleRoot(result));
    } catch (error: any) {
      sendTransactionErrorOnMetaMaskRequest(error);
      return false;
    }

    return result;
  };

  const checkPastClaim = async (): Promise<number> => {
    const { signer } = (await runPreChecks()) || {};

    if (!signer) return 0;

    const paymentsContract = new ethers.Contract(
      address || "",
      MilestonePaymentsInitializableJson.abi,
      signer
    );

    let result;

    try {
      const address = await signer.getAddress();
      result = await paymentsContract.cumulativeClaimed(address);

      dispatch(setPastClaimed(formatValue(result)));
    } catch (error: any) {
      sendTransactionErrorOnMetaMaskRequest(error);
      return 0;
    }

    return result;
  };

  const setNextMerkleRoot = async (hash: string) => {
    const { signer } = (await runPreChecks()) || {};

    if (!signer) return false;

    const paymentsContract = new ethers.Contract(
      address || "",
      MilestonePaymentsInitializableJson.abi,
      signer
    );

    try {
      const txn = await paymentsContract.setMerkleRoot(hash);
      await txn.wait(10);

      const result = await paymentsContract.merkleRoot();

      dispatch(setMerkleRoot(result));
    } catch (error: any) {
      sendTransactionErrorOnMetaMaskRequest(error);
      return;
    }
  };

  const checkWalletBalance = async (): Promise<boolean> => {
    const { signer } = (await runPreChecks()) || {};

    if (!signer) return false;

    const tokenContract = new ethers.Contract(
      NEXT_PUBLIC_TEST_USD_ADDRESS || "",
      ERC20ABI,
      signer
    );

    let result;

    try {
      result = await tokenContract.balanceOf(signer.address);

      const nextValue = formatValue(result);

      dispatch(setWalletBalance(Number(nextValue)));
    } catch (error: any) {
      sendTransactionErrorOnMetaMaskRequest(error);
      return false;
    }

    return result;
  };

  const submitClaim = async (amount: BigInt, proof: string[]) => {
    const { signer } = (await runPreChecks()) || {};

    if (!signer) return;

    const paymentsContract = new ethers.Contract(
      address || "",
      MilestonePaymentsInitializableJson.abi,
      signer
    );

    try {
      const transaction = await paymentsContract.claim(
        signer.address,
        amount,
        proof
      );
      await transaction.wait(10);
    } catch (error: any) {
      sendTransactionErrorOnMetaMaskRequest(error);
      return;
    }
  };

  return {
    getMerkleRoot,
    checkPastClaim,
    setNextMerkleRoot,
    checkWalletBalance,
    getPeriod,
    getMilestone,
    submitClaim,
  };
};

export default useMilestonePaymentTransactions;
