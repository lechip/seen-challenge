import axios from "axios";
import { SeenApiDataItem } from "./types";

const API_URL = "https://cdn.seen.com/challenge/transactions-v2.json";

export const getTransactionsFromSeenApi = async (): Promise<SeenApiDataItem[]> => {
  const response = await axios.get(API_URL);
  const data = response.data;
  return data as SeenApiDataItem[]
};