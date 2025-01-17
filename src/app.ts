import express, { Request, Response } from "express";

import { getTransactionsByCustomerId } from "./features/customer-transactions";
import { getRelatedCustomersByCustomerId } from "./features/related-customers/related-customers-controller";

const PORT = 3000; // Can be exported into env file

const app = express();

app.get('/customer-transactions/:customerId', getTransactionsByCustomerId);
app.get('/related-customers/:customerId', getRelatedCustomersByCustomerId);

// Fallback route
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Endpoint not found" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
