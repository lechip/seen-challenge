export type SeenApiDataItem = {
  transactionId: number;
  authorizationCode: string;
  transactionDate: string;
  customerId: number;
  transactionType:
  | "ACH_INCOMING"
  | "ACH_OUTGOING"
  | "POS"
  | "P2P_SEND"
  | "P2P_RECEIVE"
  | "WIRE_OUTGOING"
  | "WIRE_INCOMING"
  | "FEE";
  transactionStatus: "PENDING" | "SETTLED" | "RETURNED" | "FAILED";
  description: string;
  amount: number;
  metadata: Record<string, unknown>;
};