import React from "react";
import { Box, BoxProps, Typography } from "@mui/material";
import Image from "next/image";
import { styled } from "@mui/material/styles";

import Layout from "../layout/Layout";

const CodeBox = styled(Box)<BoxProps>(({ theme }) => ({
  backgroundColor: "#f6f8fa",
  padding: "10px",
  fontFamily: "monospace",
}));

const MainPage: React.FunctionComponent = () => {
  return (
    <Layout>
      <Typography variant="h2">Stack</Typography>
      <Typography variant="h5">- Typescript</Typography>
      <Typography variant="h5">- React.js + Redux</Typography>
      <Typography variant="h5">- Next.js (full-stack)</Typography>
      <Typography variant="h5">- ethers.js (Polygon Mumbai network)</Typography>

      <Typography variant="h2">Smart Contracts</Typography>
      <Typography variant="h5">
        Each Project Smart Contract can deal with all the costs related to the
        the project, and holds funds for each project. Each project can be 1
        client to 1 Service Provider, or 1 client to many Service Providers
      </Typography>
      <Typography variant="h5">
        In that way, each project is like a bank account for the project. But
        this is not just a bank account. This is a bank account with
        programmable money.
      </Typography>
      <Typography variant="h5">
        By hashing the payment agreement into a Merkle Hash, the Client can
        obfuscate the payment details at the start of the project. Since a
        Merkle Hash is also a single string, this lowers Smart Contract
        deployment costs.
      </Typography>
      <Typography variant="h5">
        By submitting proofs to Merkle Hashes in read-only functions, the
        Service Provider is still able to verify payment details
      </Typography>
      <Typography variant="h5">
        If the Smart Contract is coded to be immutable, code becomes ‘law’ which
        both client and service provider must follow.
      </Typography>

      <Box sx={{ width: "100%", height: "600px", position: "relative" }}>
        <Image
          src="/images/sc-gas.png"
          alt="SC Tests"
          layout="fill"
          objectFit="contain"
        />
      </Box>

      <Typography variant="h2">Factory Contract</Typography>
      <CodeBox component="pre">
        <code style={{ display: "block", whiteSpace: "pre", tabSize: 2 }}>
          {`contract MilestonePaymentsProxyFactory is Ownable {
  address public implementationContract;
  address[] public allClones;

  event NewClone(address _clone);

  constructor(address _implementation) {
      implementationContract = _implementation;
  }

  function createNewAgreement(
      bytes32 _merkleRoot,
      address _token,
      uint32 _period,
      address _mediator
  ) external returns (address instance) {
      instance = Clones.clone(implementationContract);
      (bool success, ) = instance.call(
          abi.encodeWithSignature(
              "initialize(bytes32,address,uint32,address)",
              _merkleRoot,
              _token,
              _period,
              _mediator
          )
      );
      if (!success) revert CloneFailure();

      allClones.push(instance);
      emit NewClone(instance);
      return instance;
  }
}`}
        </code>
      </CodeBox>

      <Typography variant="h2">Logic Contract</Typography>
      <CodeBox component="pre">
        <code style={{ display: "block", whiteSpace: "pre", tabSize: 2 }}>
          {`contract MilestonePaymentsInitializable is Initializable {
    using SafeERC20 for IERC20;

    event Claimed(address claimant, uint256 balance);
    event MerkelRootUpdated(bytes32 oldMerkleRoot, bytes32 newMerkleRoot);
    event MilestoneUpdated(uint32 newMilestone);
    event PeriodUpdated(uint32 newPeriod);

    bytes32 public merkleRoot;
    uint32 public period; // in months (Largest value: 2^32 - 1 = 4,294,967,295)
    uint32 public milestone; // current month
    address public mediator;
    IERC20 public token;

    mapping(address => uint256) public cumulativeClaimed;

    function initialize(
        bytes32 _merkleRoot,
        IERC20 _token,
        uint32 _period,
        address _mediator
    ) public initializer {
        if (_period < 1) revert InvalidPeriod();

        merkleRoot = _merkleRoot;
        token = _token;
        period = _period;
        mediator = _mediator;
    }

    modifier onlyMediator() {
        if (msg.sender != mediator) revert NotMediator();
        _;
    }

    function getClaimableAmount(
        address to,
        uint256 totalClaim,
        bytes32[] calldata proof,
        uint256 prevClaimed
    ) internal view returns (uint256 toClaim) {
        if (prevClaimed >= totalClaim) revert FullyClaimed();

        if (milestone < 1) revert InvalidMilestone();

        bytes32 leaf = keccak256(abi.encodePacked(to, totalClaim));
        bool isValidLeaf = MerkleProof.verify(proof, merkleRoot, leaf);
        if (!isValidLeaf) revert NotInMerkle();

        unchecked {
            // https://consensys.github.io/smart-contract-best-practices/development-recommendations/solidity-specific/integer-division/
            uint256 nextClaim = (totalClaim * milestone) / period;

            if (nextClaim == prevClaimed) revert FullyClaimed();

            toClaim = nextClaim - prevClaimed;
        }
    }

    function claim(
        address to,
        uint256 totalClaim,
        bytes32[] calldata proof
    ) external {
        uint256 claimed = cumulativeClaimed[to];
        uint256 toClaim = getClaimableAmount(to, totalClaim, proof, claimed);

        unchecked {
            cumulativeClaimed[to] = claimed + toClaim;
        }

        // NOTE: Possibility of adding a 0.3% Mediation fee to Mediator address
        token.safeTransfer(to, toClaim);
        emit Claimed(to, toClaim);
    }

    function getNextClaim(
        address to,
        uint256 totalClaim,
        bytes32[] calldata proof
    ) public view returns (uint256 nextClaim) {
        uint256 claimed = cumulativeClaimed[to];
        nextClaim = getClaimableAmount(to, totalClaim, proof, claimed);
    }

    function setMilestone(uint32 _milestone) external onlyMediator {
        if (_milestone > period) revert InvalidMilestone();

        emit MilestoneUpdated(_milestone);
        milestone = _milestone;
    }

    function setPeriod(uint32 _period) external onlyMediator {
        if (_period < milestone) revert InvalidPeriod();

        emit PeriodUpdated(_period);
        period = _period;
    }

    function setMerkleRoot(bytes32 _merkleRoot) external onlyMediator {
        emit MerkelRootUpdated(merkleRoot, _merkleRoot);
        merkleRoot = _merkleRoot;
    }
}`}
        </code>
      </CodeBox>

      <Box sx={{ width: "100%", height: "800px", position: "relative" }}>
        <Image
          src="/images/sc-tests.png"
          alt="SC Tests"
          layout="fill"
          objectFit="contain"
        />
      </Box>
    </Layout>
  );
};

export default MainPage;
