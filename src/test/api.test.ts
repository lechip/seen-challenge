import seenTestData from "./test-data/seen-api-test-data.json"
import request from 'supertest';
import express, { Application } from 'express';
import { getTransactionsByCustomerId } from '../features/customer-transactions/customer-transactions-controller';
import { getRelatedCustomersByCustomerId } from '../features/related-customers/related-customers-controller';
import { CUSTOMER_TRANSACTIONS_ENDPOINT, RELATED_CUSTOMER_TRANSACTIONS_ENDPOINT } from "../app";

let app: Application;
let server: any;

jest.mock('../common/client/seen-api-client', () => ({
  getTransactionsFromSeenApi: jest.fn().mockResolvedValue(seenTestData),
}));

beforeAll(() => {
  app = express();
  app.get(CUSTOMER_TRANSACTIONS_ENDPOINT, getTransactionsByCustomerId);
  app.get(RELATED_CUSTOMER_TRANSACTIONS_ENDPOINT, getRelatedCustomersByCustomerId);
  server = app.listen();
});

afterAll((done) => {
  jest.clearAllTimers();
  if (server) {
    console.log("Shutting down the server...");
    server.close(() => {
      console.log("Server shut down successfully.");
      done();
    });
  } else {
    done();
  }
});

describe('API Endpoints', () => {
  describe("GET /customer-transaction", () => {
    it('should return data', async () => {
      const res = await request(app).get('/customer-transactions/10');
      expect(res.status).toBe(200);
      expect(res.body.transactions).toEqual([
        {
          createdAt: "2025-01-01T13:05:00+00:00",
          updatedAt: "2025-01-01T13:05:00+00:00",
          transactionId: 35,
          authorizationCode: "B4N4N4",
          status: "PENDING",
          description: "Fika Coffee",
          transactionType: "POS",
          metadata: {
          },
          timeline: [
            {
              createdAt: "2025-01-01T13:05:00+00:00",
              status: "PENDING",
              amount: 10,
            },
          ],
        },
      ]
      );
    });

    it('should return 400 for invalid customer ID', async () => {
      const res = await request(app).get('/customer-transactions/invalid-id');
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'Invalid customer ID' });
    });
  })

  describe("GET related-customers", () => {
    it('should return data', async () => {
      const res = await request(app).get('/related-customers/4');
      expect(res.status).toBe(200);
      expect(res.body.transactions).toEqual([
        {
          relatedCustomerId: 3,
          relationType: "P2P_SEND",
        },
        {
          relatedCustomerId: 5,
          relationType: "P2P_RECEIVE",
        },
        {
          relatedCustomerId: 3,
          relationType: "DEVICE",
        },
        {
          relatedCustomerId: 6,
          relationType: "DEVICE",
        },
        {
          relatedCustomerId: 7,
          relationType: "DEVICE",
        },
        {
          relatedCustomerId: 5,
          relationType: "DEVICE",
        },
        {
          relatedCustomerId: 10,
          relationType: "DEVICE",
        },
      ]
      );
    });

    it('should return 400 for invalid customer ID', async () => {
      const res = await request(app).get('/related-customers/invalid-id');
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'Invalid customer ID' });
    });
  })

  describe("Fallback Handle", () => {
    it('handles routes that do not exist', async () => {
      const res = await request(app).get('/banana');
      expect(res.status).toBe(404);
    });
  })
});
