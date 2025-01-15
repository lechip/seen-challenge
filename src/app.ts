import express, { Request, Response } from "express";

import { endpoint1 } from "./routes/endpoint1";
import { endpoint2 } from "./routes/endpoint2";

const PORT = 3000; // Can be exported into env file

const app = express();

app.get('/endpoint1', endpoint1);
app.get('/endpoint2', endpoint2);

// Fallback route
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Endpoint not found" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
