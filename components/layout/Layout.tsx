import React from "react";
import Head from "next/head";

import { Container } from "@mui/material";

import NavBar from "./Navbar";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FunctionComponent<LayoutProps> = (props) => {
  const { children } = props;

  return (
    <>
      <Head>
        <title>Payments Agreement</title>
        <meta property="og:title" content="Payments Agreement" key="title" />
      </Head>
      <NavBar />
      <Container maxWidth="lg" sx={{ paddingTop: 8 }}>
        {children}
      </Container>
    </>
  );
};

export default Layout;
