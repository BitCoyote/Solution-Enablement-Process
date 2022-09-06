# Testing

The testing in this project can be broken down into the following:

* **Static Analysis** - Typescript, tslint, and eslint will catch typos and type errors as we write and commit code.
* **Unit Tests** - Generally for one-off functions such as things such as helpers/utils, redux slices, and files in the [shared](src/shared) directory using Jest.
* **Integration Tests** - For testing functionality that spans multiple files. 
  * For the frontend, this is mainly component testing using Jest and Testing Library.
  * For the backend, this is mainly endpoint testing using Jest and Supertest.
* **End-to-End (E2E) Tests** - For testing the main user flows of the application as a whole.

[More reading on testing](https://kentcdodds.com/blog/static-vs-unit-vs-integration-vs-e2e-tests)

## Running Unit & Integration Tests with Jest

* To run the entire test suite use `npm run test`.
    * To run only the frontend tests, use `npm run test-frontend`.
    * To run only the backend tests, use `npm run test-backend`.
    * To run only the shared tests, use `npm run test-shared`.
* The test suite will use the env variables defined in `.env.testing`
    
[jest.config.js](jest.config.js) is configured with multiple projects, allowing us to run tests in different jest environments (`node` for the backend and shared tests, `jsdom` for the frontend tests). The entire test suite will be reported to the `/coverage` folder (git-ignored) when using `npm run test`.

## Coverage
We want to have test coverage for the following:
* Utils/helpers/one-off functions (unit)
* Redux slices (unit)
* Backend endpoints (integration)
* React components (integration)
* Main user flows (e2e)

## Testing Environment & Database
When running tests, the environment variables defined in [`.env.testing`](../.env.testing) will be used. Instead of SQL Server, tests will use a SQLite in-memory database that is built as part of the setup in [test-env-setup.ts](../testing-test-env-setup.backend.ts). Every test will receieve a fresh database, so there is no need to manage data cleanup between tests. The entire mock database fixture can be found in [mock-db.ts](../testing/mocks/mock-db.ts). Data can be added to `testData` for use in tests.

Additionally, the setup scripts in the [testing folder](../testing) expose a handful useful utils to `globalThis`.
* **app** - The express app created for the current test.
* **db** - The sequelize database object created for the current test. This can be queried against in tests to verify that object were probably created/edited.
* **loggedInUserID** - The user id of the user used for testing.
* **server** - The express server created from ```app.listen(...)```
* **port** - The port the express server is running on. A random port is always chosen for each test because tests run in parallel.
* **idToken** - The id token being used for authentication. This is an old hard-coded token.
* **accessToken** - The access token being used for authentication. This is an old hard-coded token.
* **port** - The port the express server is running on. A random port is always chosen for each test because tests run in parallel.
* **request** - A supertest object already bootstrapped with the express app and `Authorization` header. This can be used in tests like so:
   ```
   await globals.request.get(`/users/me`).expect(200);
### A note on Authentication for testing
Token validation on the backend is bypassed for automated testing via the `BYPASS_AUTH` environment variable. The test user token and user id is hardcoded in [test-env-setup.ts](../testing-test-env-setup.backend.ts).
## Writing Integration Tests for Backend Endpoints
The backend endpoints are tested (with all middleware, etc) using Supertest. Calls to external 3rd party APIs should be mocked using [msw](https://www.npmjs.com/package/msw).
```
it('should successfully return a user ', async () => {
    const response = await globals.request
      .get(`/users/abc`)
      .expect(200);
    expect(response.body.id).toEqual('abc');
});
```
## Writing Integration Tests for Frontend React Components
Test react components along with the hooks and actions they use by using `renderWithProviders` from [test-utils](../src/frontend/utils/test-utils.tsx). `renderWithProviders` will wrap the component you are testing with the redux store provider and optionally a pre-loaded state that you supply. For example:
```
  const state = {
    counter: {
      value: 1,
      status: 'idle' as 'idle'
    }
  }
 renderWithProviders(<SomeComponent />, { preloadedState: state })
```
Because the entire test suite is setup with an express server and database via [test-env-setup.ts](../testing-test-env-setup.backend.ts), we can allow the frontend components and actions to make HTTP requests to the backend. HTTP requests to 3rd party API's, however, should be mocked using [msw](https://www.npmjs.com/package/msw).