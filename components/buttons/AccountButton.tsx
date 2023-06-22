import React from "react";
import { Box, BoxProps, Link, Typography } from "@mui/material";

import { styled } from "@mui/material/styles";

import MetaMaskButton from "./common/MetaMaskButton";
import MenuStyledButton from "./common/MenuStyledButton";

import useConnectWallet from "../../utils/hooks/useConnectWallet";
import { truncateString, handleOpenWindow } from "../../utils/common";

const AccountButton: React.FunctionComponent = () => {
  const { provider, account, chainId, requestConnect, requestChangeChainId } =
    useConnectWallet();

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleInstallMetamask = () => {
    handleOpenWindow("https://metamask.io/");
  };

  const handleDirectAccount = () => {
    handleOpenWindow(`https://mumbai.polygonscan.com/address/${account}`);
  };

  if (!provider)
    return (
      <MetaMaskButton
        handleClick={handleInstallMetamask}
        text="Install MetaMask"
      />
    );

  if (!account)
    return (
      <MetaMaskButton handleClick={requestConnect} text="Connect MetaMask" />
    );

  if (
    !!chainId &&
    parseInt(chainId) !==
      parseInt(process.env.NEXT_PUBLIC_NETWORK_CHAIN_ID || "80001")
  )
    return (
      <MetaMaskButton
        handleClick={requestChangeChainId}
        text="Change to Mumbai"
      />
    );

  return (
    <MenuStyledButton
      aria-describedby={id}
      variant="contained"
      onClick={handleDirectAccount}
      color="secondary"
    >
      <Typography variant="h6" sx={{ marginLeft: 1 }}>
        Account:{truncateString(account, 8)}
      </Typography>
    </MenuStyledButton>
  );
};

export default AccountButton;
