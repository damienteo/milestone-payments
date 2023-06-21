import { ethers } from "ethers";
import keccak256 from "keccak256";
import MerkleTree from "merkletreejs";

import { IPaymentDetails } from "@/interfaces/IPayment";

export const generateLeaf = (address: string, value: string): Buffer => {
  return Buffer.from(
    ethers
      .solidityPackedKeccak256(["address", "uint256"], [address, value])
      .slice(2),
    "hex"
  );
};

export const getParsedValue = (amount: number, decimals: number) => {
  return ethers.parseUnits(amount.toString(), decimals).toString();
};

export const generateMerkleTree = (details: IPaymentDetails): MerkleTree => {
  return new MerkleTree(
    Object.entries(details.payments).map(([address, amount]) => {
      return generateLeaf(
        ethers.getAddress(address),
        getParsedValue(amount, details.decimals)
      );
    }),
    keccak256,
    { sortPairs: true }
  );
};

export const getMerkleProof = (
  address: string,
  value: number,
  details: IPaymentDetails
): string[] => {
  const nextAddress = ethers.getAddress(address);
  const nextValue = getParsedValue(value, details.decimals);

  const leaf: Buffer = generateLeaf(nextAddress, nextValue);
  const tree = generateMerkleTree(details);

  return tree.getHexProof(leaf);
};
