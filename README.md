# Coding Challenge

Seen has provided you with an [API to retrieve a set of sample transactions](https://cdn.seen.com/challenge/transactions-v2.json). Using this data, we want you to build a simple Node.js application that enriches this data.

- The application should be written in Typescript and use Node.js.
- Any framework can be used (i.e. Koa, Express, Nest) but your choice of
- framework should be appropriate to the task below. You can assume that the
- complexity and scope of the task will not significantly grow in future.
- Your submission should include tests
- Your submission should work. npm start should work.
- No frontend or database is required.

## Description and Justification

- I implemented the challenge using `express` because it is a fairly simple framework that most people are familiar with.
- I organized the code in the `controller - service` pattern beacuse I found it to be very useful in the past and allows to test facade (controller) logic independently from business logic. It allows also for easier rewiring of validation and changing API endpoints.
- I kept things relatively simple, the challenge mentions there are two different users of the API but I simplified to a unified API. There could be changes such as types of authentication (perhaps the front-end with a JWT vs the backend with a service mesh internal authorization, for example) but I think I spent enough time on the challenge.
- I added tests for the service (service logic) and for the controller as integration tests. This is a compromise between keeping things sufficiently tested at the logical level and as close as E2E without having to hit external services.
- I used types for both downstream API responses and for external responses. These types could later be used to document the endpoints.
- A relatively low hanging fruit is to write a validation middleware for validating the `customerId` however I will leave that out since extending express `Request` object is non trivial and I want to time constrain the code challenge.

### API Endpoint 1: `/customer-transactions/:customerId`

- Example usage: `http://localhost:3000/customer-transactions/1`
- This endpoint aggregates the transactions of a customer using the `customerId`, then I used the `authorizationCode` to build a map of all transactions related to that `authorizationCode` (it being the key). Whenever new elements are added to a key, the transactions get sorted from oldest to newest, this allows me to always know that the last element is the latest status.
- This approach was taken because it could be somewhat easily paralelized for example, if the response from the API was very big. This way it can be batched and multiple reducers that share the final transaction map can be executed in batches, or separated further by `authorizationCode`.
- The PDF with the challenge did not explicitly specify what to do with the response's `metadata` property of each transaction, so i left it empty on purpose to not complicate that logic.

### API Endpoint 2: `/related-customers/:customerId`

- Example usage: `http://localhost:3000/related-customers/4`
- The strategy for this endpoint is to divide the related customers by common device and by `P2P` transaction. The algorithm is somewhat similar and a potential improvement could be abstracted more to make only one usage, however that could come at a cost of readability.
- The idea is to extract all the transactions that are wither `P2P` transfer or have a device, then compare agains the API data to see which other transactions share wither the `deviceId` or have a `relatedTransactionId`, then extract the corresponding customer from such transactions. There's a check to not add the customer being searched itself and I use a Set to remove duplicates.

## Installation

```bash
git clone git@github.com:lechip/seen-challenge.git
cd code-challenge-api
```

Install dependencies

```bash
npm install
```

## Usage

```bash
npm start
```

The server will run on `http://localhost:3000` by default.

There is also a development mode

```bash
npm run dev
```

## Testing

This project includes the following tests:

- Unit Tests: Cover service and utility functions. Each `src/features/{feature}/**/*.test.ts` is a unit test of this nature.
- Integration Tests: Test API endpoints with mocked external dependencies, these tests are in this project in the file `src/test/api.test.ts`

Run all tests:

```bash
npm run test
```

## Project Structure

```text
src
├── common                       # Shared logic
│   └── client                   # Shared client (external API) logic
├── features                     # feature based organization
│   ├── customer-transactions    # API 1: Customer transactions
│   └── related-customers        # API 2: Related Customers
└── test                         # General integration test of the API
    └── test-data                # Test data extracted from the provided API
```

## Technologies Used

- Node.js
- Express
- TypeScript
- Jest
- Axios

## TODO

- [x] Make first endpoint
  - [x] Test (use TDD)
- [x] Make second endpoint
  - [x] Test (use TDD)
- [x] Complete README
  - [x] Technologies
  - [x] API explaination