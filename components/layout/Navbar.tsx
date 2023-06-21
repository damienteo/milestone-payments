import React from "react";
import { AppBar, Box, BoxProps, Toolbar, Typography } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { useRouter } from "next/router";
import NextLink from "next/link";

import AccountButton from "../buttons/AccountButton";
import MenuStyledButton from "../buttons/common/MenuStyledButton";

const StyledBox = styled(Box)<BoxProps>(() => ({
  flexGrow: 1,
}));

const NavBar: React.FunctionComponent = () => {
  const router = useRouter();
  const theme = useTheme();

  return (
    <div style={{ flexGrow: 1 }}>
      <AppBar position="fixed" color="secondary" elevation={5}>
        <Toolbar>
          <StyledBox>
            <Typography>Payments Agreement</Typography>
          </StyledBox>
          <AccountButton />
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default NavBar;
