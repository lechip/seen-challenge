import request from 'supertest';
import express from 'express';
import { endpoint1 } from '../routes/endpoint1';
import { endpoint2 } from '../routes/endpoint2';

const app = express();
app.get('/endpoint1', endpoint1);
app.get('/endpoint2', endpoint2);

jest.mock('../services/seenApiClient', () => ({
  seenApiClient: jest.fn((url) => {
    if (url.includes('endpoint1')) return { data: 'mocked data for endpoint1' };
    if (url.includes('endpoint2')) return { data: 'mocked data for endpoint2' };
    throw new Error('Unknown URL');
  }),
}));

describe('API Endpoints', () => {
  it('GET /endpoint1 should return data', async () => {
    const res = await request(app).get('/endpoint1');
    expect(res.status).toBe(200);
    expect(res.body.data).toBe('mocked data for endpoint1');
  });

  it('GET /endpoint2 should return data', async () => {
    const res = await request(app).get('/endpoint2');
    expect(res.status).toBe(200);
    expect(res.body.data).toBe('mocked data for endpoint2');
  });
});
