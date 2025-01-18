import { TransactionStatus, TransactionType } from "../../common/types";

export type TransactionTimelineItem = {
  createdAt: string;
  status: TransactionStatus;
  amount: number;
};

export type Transaction = {
  createdAt: string;
  updatedAt: string;
  transactionId: number;
  authorizationCode: string;
  status: TransactionStatus;
  description: string;
  transactionType: TransactionType;
  metadata: Record<string, unknown>;
  timeline: TransactionTimelineItem[];
};