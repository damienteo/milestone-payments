import React from "react";
import { Button, Typography } from "@mui/material";
import Image from "next/image";

interface IMetaMaskButton {
  text: string;
  handleClick: () => void;
}

const MetaMaskButton: React.FunctionComponent<IMetaMaskButton> = (props) => {
  const { handleClick, text } = props;

  return (
    <Button variant="contained" onClick={handleClick}>
      <Image
        src="/metamask-logo-black-and-white.png"
        alt="me"
        width="28"
        height="28"
      />
      <Typography variant="h6" sx={{ marginLeft: 1 }}>
        {text}
      </Typography>
    </Button>
  );
};

export default MetaMaskButton;
