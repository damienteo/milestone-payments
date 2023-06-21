import { useState, useCallback, useEffect } from "react";
import { ethers } from "ethers";

import useDispatchErrors from "./useDispatchErrors";

const NEXT_PUBLIC_MUMBAI_API_ENDPOINT =
  process.env.NEXT_PUBLIC_MUMBAI_API_ENDPOINT;

const useConnectWallet = () => {
  const { sendTransactionErrorOnMetaMaskRequest } = useDispatchErrors();

  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [provider, setProvider] = useState<any>(null);

  const findProvider = async () => {
    if (!window) return;

    const { ethereum } = window as any;

    const nextProvider = ethereum
      ? new ethers.BrowserProvider(ethereum, "any")
      : ethers.getDefaultProvider(NEXT_PUBLIC_MUMBAI_API_ENDPOINT!);

    setProvider(nextProvider);
  };

  const accountChangedHandler = async (newAccount: any) => {
    const address = await newAccount.getAddress();
    setAccount(address);

    enquireChainId();
  };

  const enquireChainId = useCallback(async () => {
    const network = await provider.getNetwork();

    if (network?.chainId) {
      setChainId(network.chainId);
    }
  }, [provider]);

  const enquireAccounts = async () => {
    const accounts = await provider.listAccounts();

    if (accounts?.[0]) {
      setAccount(accounts[0]);
    }
  };

  const checkConnection = useCallback(async () => {
    await enquireChainId();
    await enquireAccounts();
  }, [provider]);

  const requestConnect = async () => {
    if (!provider) return;

    try {
      await provider.send("eth_requestAccounts", []);
      await accountChangedHandler(provider.getSigner());
    } catch (error) {
      sendTransactionErrorOnMetaMaskRequest(error);
    }
  };

  const requestChangeChainId = async () => {
    if (!window) return;

    const { ethereum } = window as any;

    ethereum
      .request({
        method: "wallet_switchEthereumChain",
        params: [
          {
            chainId: "0x13881",
          },
        ],
      })
      .catch((error: any) => sendTransactionErrorOnMetaMaskRequest(error));
  };

  useEffect(() => {
    // window exists only in browser
    if (!window) return;

    const { ethereum } = window as any;

    if (ethereum) {
      findProvider();
    }
  }, []);

  useEffect(() => {
    if (!provider) return;

    checkConnection();
  }, [provider, checkConnection]);

  useEffect((): any => {
    const { ethereum } = window as any;
    if (ethereum?.on) {
      ethereum.on("connect", checkConnection);
      ethereum.on("disconnect", checkConnection);
      ethereum.on("chainChanged", enquireChainId);
      ethereum.on("accountsChanged", checkConnection);
      ethereum.on("chainChanged", enquireChainId);

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener("connect", checkConnection);
          ethereum.removeListener("disconnect", checkConnection);
          ethereum.removeListener("chainChanged", enquireChainId);
          ethereum.removeListener("accountsChanged", checkConnection);
          ethereum.removeListener("chainChanged", enquireChainId);
        }
      };
    }
  }, [checkConnection, enquireChainId]);

  return {
    provider,
    account,
    chainId,
    requestConnect,
    requestChangeChainId,
  };
};

export default useConnectWallet;
