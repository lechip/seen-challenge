import { getTransactionsFromSeenApi } from "../../client/seen-api-client";
import { SeenApiDataItem } from "../../client/types";
import { Transaction, TransactionTimelineItem } from "./types"

type TransactionsMap = Record<string, SeenApiDataItem[]>;

export const serviceGetTransactionsByCustomer = async (customerId: number): Promise<Transaction[]> => {
  // filter customer transactions
  const seenData = await getTransactionsFromSeenApi()
  const filteredDataByCustomer = seenData.filter(transaction => transaction.customerId === customerId)
  // build transaction hash-map build map from transaction related by authorization code sorted from oldest to newest
  const groupedTransactions = groupAndSortTransactionsByAuthorizationCode(filteredDataByCustomer)
  // for each one of the elements of the map, take the last transaction an build the transaction object
  const responseTransactions = Object.keys(groupedTransactions).flatMap(transactionGroupKey => mapSortedDataToTransactionResponse(groupedTransactions[transactionGroupKey], transactionGroupKey))
  return responseTransactions
}

const groupAndSortTransactionsByAuthorizationCode = (
  transactions: SeenApiDataItem[]
): TransactionsMap => {
  return transactions.reduce<TransactionsMap>((acc, transaction) => {
    const { authorizationCode } = transaction;

    // Initialize the array for this authorizationCode if it doesn't exist
    if (!acc[authorizationCode]) {
      acc[authorizationCode] = [];
    }

    // Add the current transaction to the corresponding array
    acc[authorizationCode].push(transaction);

    // Sort the array by transactionDate
    acc[authorizationCode].sort(
      (a, b) => new Date(a.transactionDate).getTime() - new Date(b.transactionDate).getTime()
    );

    return acc;
  }, {});
};

const mapSortedDataToTransactionResponse = (apiTransactions: SeenApiDataItem[], transactionGroupKey: string): Transaction => {
  const lastTransaction = apiTransactions[apiTransactions.length - 1]
  const firstTransaction = apiTransactions[0]
  const mappedTransactionResponse: Transaction = {
    createdAt: firstTransaction.transactionDate,
    updatedAt: lastTransaction.transactionDate,
    transactionId: firstTransaction.transactionId,
    authorizationCode: transactionGroupKey,
    status: lastTransaction.transactionStatus,
    description: firstTransaction.description,
    transactionType: firstTransaction.transactionType,
    metadata: {}, // I will simplify to this since is not specified how to reconcile these
    timeline: apiTransactions.map(transaction => ({ createdAt: transaction.transactionDate, status: transaction.transactionStatus, amount: transaction.amount }))
  }
  return mappedTransactionResponse
}
