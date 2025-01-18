import seenTestData from "../../test/test-data/seen-api-test-data.json"
import { serviceGetRelatedCustomersByCustomerId } from './related-customers-service';
import * as seenApiClient from '../../common/client/seen-api-client';
import { CustomerRelationship, RelationType } from './types';

jest.mock('../../common/client/seen-api-client', () => ({
  getTransactionsFromSeenApi: jest.fn().mockResolvedValue(seenTestData),
}));

describe('serviceGetRelatedCustomersByCustomerId', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return relationships based on transfers', async () => {
    const customerId = 4;

    const relationships = await serviceGetRelatedCustomersByCustomerId(customerId);

    // Check if the result contains transfer relationships
    const transferRelationships = relationships.filter(
      (relationship) => relationship.relationType === RelationType.P2P_SEND || relationship.relationType === RelationType.P2P_RECEIVE
    );

    expect(transferRelationships).toBeDefined();
    expect(transferRelationships.length).toBeGreaterThan(0);

    // Verify the relationship data structure
    transferRelationships.forEach((relationship) => {
      expect(relationship).toHaveProperty('relatedCustomerId');
      expect(relationship).toHaveProperty('relationType');
      expect([RelationType.P2P_RECEIVE, RelationType.P2P_SEND]).toContain(relationship.relationType);
    });
  });

  it('should return relationships based on shared device IDs', async () => {
    const customerId = 4;

    const relationships = await serviceGetRelatedCustomersByCustomerId(customerId);

    // Check if the result contains device relationships
    const deviceRelationships = relationships.filter(
      (relationship) => relationship.relationType === RelationType.DEVICE
    );

    expect(deviceRelationships).toBeDefined();
    expect(deviceRelationships.length).toBeGreaterThan(0);

    // Verify the relationship data structure
    deviceRelationships.forEach((relationship) => {
      expect(relationship).toHaveProperty('relatedCustomerId');
      expect(relationship).toHaveProperty('relationType');
      expect(relationship.relationType).toBe(RelationType.DEVICE);
    });
  });

  it('should return an empty array if the customer has no transactions', async () => {
    const customerId = 999;

    const relationships = await serviceGetRelatedCustomersByCustomerId(customerId);

    expect(relationships).toEqual([]);
  });

  it('should exclude the queried customer from the relationships', async () => {
    const customerId = 4;

    const relationships = await serviceGetRelatedCustomersByCustomerId(customerId);

    // Ensure that the related customer IDs do not include the original customer ID
    relationships.forEach((relationship) => {
      expect(relationship.relatedCustomerId).not.toEqual(customerId);
    });
  });

  it('should handle customers with no device IDs gracefully', async () => {
    const customerId = 2;

    const relationships = await serviceGetRelatedCustomersByCustomerId(customerId);

    const deviceRelationships = relationships.filter(
      (relationship) => relationship.relationType === RelationType.DEVICE
    );

    expect(deviceRelationships).toEqual([]);
  });

  it('should handle customers with no related transfers gracefully', async () => {
    const customerId = 10;

    const relationships = await serviceGetRelatedCustomersByCustomerId(customerId);

    const transferRelationships = relationships.filter(
      (relationship) => relationship.relationType === RelationType.P2P_SEND || relationship.relationType === RelationType.P2P_RECEIVE
    );

    expect(transferRelationships).toEqual([]);
  });
});
