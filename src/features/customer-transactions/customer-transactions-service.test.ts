import seenTestData from "../../test/test-data/seen-api-test-data.json"
import * as seenApiClient from '../../common/client/seen-api-client';
import { serviceGetTransactionsByCustomer } from "./customer-transactions-service";
import { Transaction } from "./types";

jest.mock('../../common/client/seen-api-client', () => ({
  getTransactionsFromSeenApi: jest.fn().mockResolvedValue(seenTestData),
}));

describe("customer-transactions-service", () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns the sorted transactions by customer", async () => {
    const customerId = 1;
    const transactionDataForCustomer = await serviceGetTransactionsByCustomer(customerId);

    expect(transactionDataForCustomer).toBeDefined();
    expect(Array.isArray(transactionDataForCustomer)).toBe(true);

    // Validate the structure of each transaction
    transactionDataForCustomer.forEach((transaction: Transaction) => {
      expect(transaction).toHaveProperty("createdAt");
      expect(transaction).toHaveProperty("updatedAt");
      expect(transaction).toHaveProperty("transactionId");
      expect(transaction).toHaveProperty("authorizationCode");
      expect(transaction).toHaveProperty("status");
      expect(transaction).toHaveProperty("description");
      expect(transaction).toHaveProperty("transactionType");
      expect(transaction).toHaveProperty("metadata");
      expect(transaction).toHaveProperty("timeline");

      // Validate that the timeline is sorted from oldest to newest
      for (let i = 1; i < transaction.timeline.length; i++) {
        const prevDate = new Date(transaction.timeline[i - 1].createdAt).getTime();
        const currDate = new Date(transaction.timeline[i].createdAt).getTime();
        expect(prevDate).toBeLessThanOrEqual(currDate);
      }
    });
  });

  it("maps the correct createdAt and updatedAt for each transaction group", async () => {
    const customerId = 1;
    const transactionDataForCustomer = await serviceGetTransactionsByCustomer(customerId);

    transactionDataForCustomer.forEach((transaction: Transaction) => {
      const timelineDates = transaction.timeline.map((item) =>
        new Date(item.createdAt).getTime()
      );

      const earliestDate = Math.min(...timelineDates);
      const latestDate = Math.max(...timelineDates);

      // createdAt should match the earliest timeline date
      expect(new Date(transaction.createdAt).getTime()).toEqual(earliestDate);

      // updatedAt should match the latest timeline date
      expect(new Date(transaction.updatedAt).getTime()).toEqual(latestDate);
    });
  });

  it("uses the status of the latest transaction in the group", async () => {
    const customerId = 1;
    const transactionDataForCustomer = await serviceGetTransactionsByCustomer(customerId);

    transactionDataForCustomer.forEach((transaction: Transaction) => {
      const latestTimelineItem = transaction.timeline[transaction.timeline.length - 1];
      expect(transaction.status).toEqual(latestTimelineItem.status);
    });
  });

  it("returns an empty array if no transactions exist for the customer", async () => {
    jest.spyOn(seenApiClient, "getTransactionsFromSeenApi").mockResolvedValueOnce([]);

    const customerId = 99; // Assume this ID has no transactions
    const transactionDataForCustomer = await serviceGetTransactionsByCustomer(customerId);

    expect(transactionDataForCustomer).toEqual([]);
  });
})