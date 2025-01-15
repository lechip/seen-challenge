import { Request, Response } from 'express';
import { seenApiClient } from '../services/seenApiClient';

export const endpoint1 = async (req: Request, res: Response) => {
  try {
    const data = await seenApiClient();
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