import { getTransactionsFromSeenApi } from "../../common/client/seen-api-client";
import { SeenApiDataItem } from "../../common/client/types";
import { TransactionType } from "../../common/types";
import { CustomerRelationship, RelationType } from "./types";

export const serviceGetRelatedCustomersByCustomerId = async (customerId: number): Promise<CustomerRelationship[]> => {
  // filter customer transactions
  const seenData = await getTransactionsFromSeenApi()
  const filteredDataByCustomer = seenData.filter(transaction => transaction.customerId === customerId)
  // get relationships based on transfer
  const customersRelatedByTransfer = getRelatedCustomersByTransfer(seenData, customerId)
  // get relationships based on deviceID
  const customersRelatedByDevice = getRelatedCustomersByDevice(seenData, customerId)

  // aggregate the transactions
  return [...customersRelatedByTransfer, ...customersRelatedByDevice]
}

const getRelatedCustomersByTransfer = (
  seenData: SeenApiDataItem[],
  customerId: number
): CustomerRelationship[] => {
  // Find customer's transfer transactions
  const relatedTransactionIds = seenData
    .filter((transaction) => transaction.customerId === customerId &&
      (transaction.transactionType === TransactionType.P2P_SEND || transaction.transactionType === TransactionType.P2P_RECEIVE))
    .map((transaction) => transaction.metadata.relatedTransactionId)

  // If no trasnaction IDs are found, return an empty array
  if (relatedTransactionIds.length === 0) {
    return []
  }

  const others = seenData.filter(
    (transaction) =>
      relatedTransactionIds.includes(transaction.transactionId) &&
      transaction.customerId !== customerId // Exclude the customer that is being queried
  )
  const relatedCustomerItems = others
    .map((transaction) => ({
      relatedCustomerId: transaction.customerId,
      relationType: transaction.transactionType === TransactionType.P2P_SEND ? RelationType.P2P_SEND : RelationType.P2P_RECEIVE
    }));

  // Remove duplicates
  return Array.from(new Set(relatedCustomerItems)) as CustomerRelationship[];
}

const getRelatedCustomersByDevice = (
  seenData: SeenApiDataItem[],
  customerId: number
): CustomerRelationship[] => {
  // Find the device IDs associated with the given customer ID
  const deviceIds = seenData
    .filter((transaction) => transaction.customerId === customerId)
    .map((transaction) => transaction.metadata?.deviceId)
    .filter((deviceId): deviceId is string => !!deviceId);

  // If no device IDs are found, return an empty array
  if (deviceIds.length === 0) {
    return [];
  }

  // Find all customers who have used the same device IDs
  const relatedCustomerIds = seenData
    .filter(
      (transaction) =>
        deviceIds.includes(transaction.metadata?.deviceId || "") &&
        transaction.customerId !== customerId // Exclude the customer that is being queried
    )
    .map((transaction) => transaction.customerId);

  // Remove duplicates
  const dedupRelatedCustomerIds = Array.from(new Set(relatedCustomerIds));

  return dedupRelatedCustomerIds
    .map(relatedCustomerId => ({ relatedCustomerId, relationType: RelationType.DEVICE }))
};