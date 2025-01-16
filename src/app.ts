import express, { Request, Response } from "express";

import { getTransactionsByCustomer } from "./features/customer-transactions";
import { endpoint2 } from "./features/endpoint2";

const PORT = 3000; // Can be exported into env file

const app = express();

app.get('/customer-transactions/:customerId', getTransactionsByCustomer);
app.get('/endpoint2', endpoint2);

// Fallback route
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Endpoint not found" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
