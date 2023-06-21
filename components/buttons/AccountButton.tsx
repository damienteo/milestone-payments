import React from "react";
import { Box, BoxProps, Link, Popover, Typography } from "@mui/material";

import HouseIcon from "@mui/icons-material/House";
import PaymentsIcon from "@mui/icons-material/Payments";
import CodeIcon from "@mui/icons-material/Code";
import { styled } from "@mui/material/styles";

import MetaMaskButton from "./common/MetaMaskButton";
import MenuStyledButton from "./common/MenuStyledButton";
import AccountLink from "./common/AccountLink";
import PopoverBox from "./common/PopoverBox";

import useConnectWallet from "../../utils/hooks/useConnectWallet";
import { truncateString, handleOpenWindow } from "../../utils/common";

const StyledBox = styled(Box)<BoxProps>(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const AccountButton: React.FunctionComponent = () => {
  const { provider, account, chainId, requestConnect, requestChangeChainId } =
    useConnectWallet();

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleInstallMetamask = () => {
    handleOpenWindow("https://metamask.io/");
  };

  const handleDirectFaucet = () => {
    handleOpenWindow("https://mumbaifaucet.com/");
  };

  return (
    <>
      <MenuStyledButton
        aria-describedby={id}
        variant="contained"
        onClick={handleClick}
      >
        <Typography variant="h6" sx={{ marginLeft: 1 }}>
          Links
        </Typography>
      </MenuStyledButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          horizontal: "center",
          vertical: "bottom",
        }}
        keepMounted
        PaperProps={{
          elevation: 0,
          variant: "outlined",
          sx: {
            width: 300,
          },
        }}
        transitionDuration={300}
        sx={{
          top: 20,
        }}
      >
        <PopoverBox sx={{ textAlign: "center" }}>
          {!!account && (
            <StyledBox>
              <Typography variant="h5">
                Account:{" "}
                <Link
                  href={`https://mumbai.polygonscan.com/address/${account}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {truncateString(account, 8)}
                </Link>
              </Typography>
            </StyledBox>
          )}

          <AccountLink href="/" text="Intro" icon={<HouseIcon />} />

          <AccountLink href="/code" text="Code" icon={<CodeIcon />} />

          <AccountLink
            href="/payments"
            text="Payments"
            icon={<PaymentsIcon />}
          />

          {!provider && (
            <MetaMaskButton
              handleClick={handleInstallMetamask}
              text="Install MetaMask"
            />
          )}

          {!account && (
            <MetaMaskButton
              handleClick={requestConnect}
              text="Connect MetaMask"
            />
          )}

          {!!chainId &&
            parseInt(chainId) !==
              parseInt(process.env.NEXT_PUBLIC_NETWORK_CHAIN_ID || "80001") && (
              <MetaMaskButton
                handleClick={requestChangeChainId}
                text="Change to Mumbai"
              />
            )}
        </PopoverBox>
      </Popover>
    </>
  );
};

export default AccountButton;
