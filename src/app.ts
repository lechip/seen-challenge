import express, { Request, Response } from "express";

import { getTransactionsByCustomerId } from "./features/customer-transactions";
import { getRelatedCustomersByCustomerId } from "./features/related-customers/related-customers-controller";

export const CUSTOMER_TRANSACTIONS_ENDPOINT = `/customer-transactions/:customerId`;
export const RELATED_CUSTOMER_TRANSACTIONS_ENDPOINT = `/related-customers/:customerId`;

const app = express();

app.get(CUSTOMER_TRANSACTIONS_ENDPOINT, getTransactionsByCustomerId);
app.get(RELATED_CUSTOMER_TRANSACTIONS_ENDPOINT, getRelatedCustomersByCustomerId);

// Fallback route
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Endpoint not found" });
});

export default app;