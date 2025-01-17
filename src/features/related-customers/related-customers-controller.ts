import { Request, Response } from 'express';
import { serviceGetRelatedCustomersByCustomerId } from "./related-customers-service";

export const getRelatedCustomersByCustomerId = async (req: Request<{ customerId: string; }>, res: Response) => {
  try {
    // Extract the customer ID from the URL
    const customerId = parseInt(req.params.customerId);

    // Check if the ID is a valid number
    if (isNaN(customerId)) {
      res.status(400).json({ error: 'Invalid customer ID' });
      return;
    }

    const responseTransactions = await serviceGetRelatedCustomersByCustomerId(customerId);
    res.json({ transactions: responseTransactions });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      console.log('An unknown error occurred:', error);
    }
    res.status(500).json({ error: "Server error" })
    return;
  }
};
