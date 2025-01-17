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
- I organized the code in the `controller - service` pattern beacuse I found it to be very useful in the past and allows to test fascade (controller) logic independently from business logic. It allows also for easier rewiring of validation and changing API endpoints.
- I kept things relatively simple, the challenge mentions there are two different users of the API but I simplified to a unified API. There could be changes such as types of authentication (perhaps the front-end with a JWT vs the backend with a service mesh internal authorization, for example) but I think I spent enough time on the challenge.
- I added tests for the service (service logic) and for the controller as integration tests. This is a compromise between keeping things sufficiently tested at the logical level and as close as E2E without having to hit external services.
- I used types for both downstream API responses and for external responses. This could be later used to document the endpoints, for example.

### API Endpoint 1: `/customer-transactions/:customerId`

- Example usage: `http://localhost:3000/customer-transactions/1`
- This endpoint agregates the transactions of a customer using the `customerId`, then I used the `authorizationCode` to build a map of all transactions related to that `authorizatiobnCode` (it being the key). Whenever new elements are added to a key, the transactions get sorted from oldest to newest, this allows me to always know that the last element is the latest status.
- This approach was taken because it could be somewhat easily paralelized for example, if the response from the API was very big. This way it can be batched and multiple reducers that share the final transaction map can be executed in batches, or separated further by `authorizationCode`.
- The PDF with the challenge did not explicitly specify what to do with the response's `metadata` property of each transaction, so i left it empty on purpose to not complicate that logic.

### API Endpoint 2: TODO:

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

Run all tests:

```bash
npm run test
```

## Project Structure

```text
src
├── client                       # Shared client (external API) logic
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
- [ ] Make second endpoint
  - [ ] Test (use TDD)
- [ ] Documentaiton of endpoints
- [ ] Complete README
  - [ ] Technologies
  - [ ] API explaination
- [ ] Refactor the controller logic (or add validator)
- [ ] Host it somewhere (?)