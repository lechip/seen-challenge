import { TransactionStatus, TransactionType } from "../types";

export type SeenApiDataItem = {
  transactionId: number;
  authorizationCode: string;
  transactionDate: string;
  customerId: number;
  transactionType: TransactionType;
  transactionStatus: TransactionStatus;
  description: string;
  amount: number;
  metadata: {
    relatedTransactionId?: number,
    deviceId?: string,
  };
};