export type TransactionTimelineItem = {
  createdAt: string;
  status: "PROCESSING" | "SETTLED" | "PENDING" | "RETURNED" | "FAILED";
  amount: number;
};

export type Transaction = {
  createdAt: string;
  updatedAt: string;
  transactionId: number;
  authorizationCode: string;
  status: "PROCESSING" | "SETTLED" | "PENDING" | "RETURNED" | "FAILED";
  description: string;
  transactionType: "ACH_INCOMING" | "ACH_OUTGOING" | "POS" | "P2P_SEND" | "P2P_RECEIVE" | "WIRE_OUTGOING" | "WIRE_INCOMING" | "FEE";
  metadata: Record<string, unknown>;
  timeline: TransactionTimelineItem[];
};