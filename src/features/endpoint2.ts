import { Request, Response } from 'express';
import { getTransactionsFromSeenApi } from '../client/seen-api-client';

export const endpoint2 = async (req: Request, res: Response) => {
  try {
    const data = await getTransactionsFromSeenApi();
    // Aggregate or process data here
    res.json({ data });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      console.log('An unknown error occurred:', error);
    }
  }
};