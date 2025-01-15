import axios from "axios";

const API_URL = "https://cdn.seen.com/challenge/transactions-v2.json";

/**
 * TODO: docs
 * @returns 
 */
export const seenApiClient = async () => {
  const response = await axios.get(API_URL);
  const data = response.data;

  // TODO: adjust according to data
  return {
    totalItems: data.length,
    items: data,
  };
};