export enum TransactionType {}
export interface ITransaction {
  from: string;
  to: string;
  transactionHash: string;
  tokenId?: number;
  category: TransactionType;
}

export interface IPendingTransaction {
  tokenId?: number;
  description?: string;
  name?: string;
  type: TransactionType;
}
