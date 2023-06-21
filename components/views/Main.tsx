import React from "react";
import { Box, Typography } from "@mui/material";

import Layout from "../layout/Layout";

const MainPage: React.FunctionComponent = () => {
  return (
    <Layout>
      <Box>
        <Typography>
          Introduction: - What can banks do in a Web3 world, other than becoming
          crypto custodians like DBS and SCB? In terms of lending, we already
          have Aave. In terms of exchange between currencies, we potentially
          have dapps such as Uniswap. - Regardless, Smart Contracts on an
          EVM-compatible chain can help Banks to streamline B2B transactions.
          Smart contracts provide transparent, immutable rules for both clients
          and service providers - In the off-chain world, dealing with off-chain
          assets, you will still need a trusted third-party to act as an
          arbitrator or an escrow service in a situation wherein a client and a
          service provider can potentially become adversaries due to business
          disagreements.
        </Typography>
        <Typography>
          Problem: - Client wants to release money to the provider only when the
          provider meets specific milestones. - Service Providers wants to know
          that the client can pay for services until the end of the project -
          Both parties want to know that the counterparty can hold up their end
          of a transaction, and for transactions to be carried out in a
          transparent and speedy manner.
        </Typography>
        <Typography>
          Caveat: - Smart Contracts are public. As such, values and parties are
          public as well, even with pseudonymous wallet addresses. Clients may
          not want to be too open with the budget for projects
        </Typography>
        <Typography>
          Solution: - Payment Agreement Smart Contracts, for which details are
          obscured via a Merkle Hash - Bank as the trusted third party which can
          stop payment in the event of issues
        </Typography>
        <Typography>
          Benefits: - Transparency: Proof of Funds on the part of the client. In
          a Web2 world, even if the banks can attest to the funds owned by the
          client, the providers do not know if the funds have been allocated to
          other projects - Clarity on Rules: Smart Contracts are public, anyone
          from both companies can read through the Smart Contract and understand
          the rules - Public Ledger: Accountants can use transactions logs to
          support accounting - Pseudonymous: Wallet Addresses are pseudonymous -
          Initially obscured: Merkle hashes not only saves on network
          transaction costs to update or deploy, but also obscures transaction
          details initially - Fast settlement: Transactions can be cleared as
          soon as it is confirmed on the blockchain - Minimized human
          intervention: While the bank can provide the smart contracts and some
          admin support in terms of blocking/allowing payments, there is less
          need for other staff in terms of operations or legal
        </Typography>
        <Typography>
          Smart Contracts: - Factory Clones which point to the Merkle Hash
          Payment Agreement main contract to save on deployment costs for new
          Project Contracts - Each Project SC can deal with all the costs
          related to the the project, holds funds for each project. Each project
          can be 1 client to 1 Service Provider, or 1 client to many Service
          Providers (Service Providers need not be defined in the Smart
          Contract, only the client) - In that way, each project is like a bank
          account for the project. But this is not just a bank account. This is
          a bank account with programmable money. - By hashing the payment
          agreement into a Merkle Hash, the Client can obfuscate the payment
          details at the start of the project. Since a Merkle Hash is also a
          single string, this lowers Smart Contract deployment costs. - By
          submitting proofs to Merkle Hashes in read-only functions, the Service
          Provider is still able to verify payment details despite the Smart
          Contract being in a public domain - If the Smart Contract is coded to
          be immutable, code becomes ‘law’ which both client and service
          provider must follow.
        </Typography>
        <Typography>
          Role of the Bank: - Smart Contract maintenance and deployment -
          Updating of milestones in Project SC, which will release payments to
          Service Providers accordingly - Arbitration if projects unexpectedly
          end in the midst of a project
        </Typography>
        <Typography>
          Benefit to the bank: Bank gets 0.3%(?) of every transaction until the
          end of the project, providing incentive to see through the process
          till the end. This can be programmed straight into the Smart Contract
          itself.
        </Typography>
        <Typography>
          Stack: - Typescript - React.js + Redux - Next.js (full-stack) -
          ethers.js (Polygon Mumbai - for speed, but since this is EVM, can use
          any other EVM chain, even the original Ethereum chain, depending on
          emphasis on security and decentralisation)
        </Typography>
      </Box>
    </Layout>
  );
};

export default MainPage;
