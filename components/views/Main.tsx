import React from "react";
import { Box, Typography } from "@mui/material";

import Layout from "../layout/Layout";

const MainPage: React.FunctionComponent = () => {
  return (
    <Layout>
      <Typography variant="h2">Introduction</Typography>
      <Typography variant="h5">
        - Banks in Web3: Just crypto custodians?
      </Typography>
      <Typography variant="h5">
        - Web3 as banks: Lending - Aave. Exchange - Uniswap.
      </Typography>
      <Typography variant="h5">
        - Smart Contracts can help Banks to streamline B2B transactions by
        providing transparent, immutable rules.
      </Typography>
      <Typography variant="h5">
        - Banks can be the trusted third-party to act as arbitrators for
        disagreements in the off-chain world.
      </Typography>

      <Typography variant="h2">Problem</Typography>
      <Typography variant="h5">
        B2B Transactions involve large sums of money taking place over a long
        period of time.
      </Typography>
      <Typography variant="h5">
        Client wants to release money to the provider only when the provider
        meets specific milestones.
      </Typography>
      <Typography variant="h5">
        Service Providers wants to know that the client can pay for services
        until the end of the project
      </Typography>
      <Typography variant="h5">
        Both parties want to know that the counterparty can hold up their end of
        a transaction, and for transactions to be carried out in a transparent
        and speedy manner.
      </Typography>

      <Typography variant="h2">Caveat</Typography>
      <Typography variant="h5">
        Smart Contracts are public. As such, values and parties are public as
        well, even with pseudonymous wallet addresses. Clients may not want to
        be too open with the budget for projects.
      </Typography>

      <Typography variant="h2">Solution</Typography>
      <Typography variant="h5">
        Payment Agreement Smart Contracts, for which payment details are
        obscured via a Merkle Hash
      </Typography>
      <Typography variant="h5">
        Service providers will not initially know the payments for other
        parties. With valid proofs, they can verify the final payment amounts
        according to the chain.
      </Typography>
      <Typography variant="h5">
        Bank as the trusted third party which can release payments, or stop
        payment in the event of issues
      </Typography>

      <Typography variant="h2">Benefits</Typography>
      <Typography variant="h5">
        <u>Transparency</u>: Proof of Funds on the part of the client. In a Web2
        world, even if the banks can attest to the funds owned by the client,
        the providers do not know if the funds have been allocated to other
        projects
      </Typography>
      <Typography variant="h5">
        <u>Clarity on Rules</u>: Smart Contracts are public, anyone from both
        companies can read through the Smart Contract and understand the rules
      </Typography>
      <Typography variant="h5">
        <u>Public Ledger</u>: Accountants can use transactions logs to support
        accounting
      </Typography>
      <Typography variant="h5">
        <u>Peudonymous</u>: Wallet Addresses are pseudonymous
      </Typography>
      <Typography variant="h5">
        <u>Initially obscured</u>: Merkle hashes not only saves on network
        transaction costs to update or deploy, but also obscures transaction
        details initially
      </Typography>
      <Typography variant="h5">
        <u>Fast settlement</u>: Transactions can be cleared as soon as it is
        confirmed on the blockchain
      </Typography>
      <Typography variant="h5">
        <u>Minimized human intervention</u>: While the bank can provide the
        smart contracts and some admin support in terms of blocking/allowing
        payments, there is less need for other staff in terms of operations or
        legal
      </Typography>

      <Typography variant="h2">Role of the Bank</Typography>
      <Typography variant="h5">
        - Smart Contract maintenance and deployment
      </Typography>
      <Typography variant="h5">
        - Updating of milestones in Project SC, which will release payments to
        Service Providers accordingly
      </Typography>
      <Typography variant="h5">
        - Arbitration if projects unexpectedly end in the midst of a project
      </Typography>

      <Typography variant="h2">Benefits to the Bank</Typography>
      <Typography variant="h5">
        - Bank gets 0.3%(?) of every transaction until the end of the project,
        providing incentive to see through the process till the end. This can be
        programmed straight into the Smart Contract itself.
      </Typography>
      <Typography variant="h5">- Manpower savings</Typography>
    </Layout>
  );
};

export default MainPage;
