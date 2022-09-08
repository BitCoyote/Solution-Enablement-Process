# Testing

The testing in this project can be broken down into the following:

* **Static Analysis** - Typescript, tslint, prettier, and eslint will catch typos and type errors as we write and commit code.
* **Unit Tests** - Generally for one-off functions such as things such as helpers/utils and files in the [shared](src/shared) directory.
* **Integration Tests** - For testing functionality that spans multiple files. 
  * For the frontend, this is mainly component, Redux slices, and RTK Query API testing using Jest and Testing Library.
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
Token validation on the backend is bypassed for automated testing via the `BYPASS_AUTH` environment variable. The test user tokens and user id is hardcoded in the test setup files.

# Coverage
We want to have test coverage for the following:
* [Unit Tests for Utils](#unit-tests-for-utils)
* [Integration Tests for React Components](#integration-tests-for-react-components)
* [Integration Tests for Redux Slices and RTK Query APIs](#integration-tests-for-redux-slices-and-rtk-query-apis)
* [Integration Tests for Backend Endpoints](#integration-tests-for-backend-endpoints)
* [E2E Tests for Main User Flows](#e2e-tests-for-main-user-flows)

## Unit Tests for Utils
Unit tests in this project are used primarily for helper/util functions, such as you might find in the [shared](../src/shared) folder. That doesn't mean you can't write unit tests for other things if needed!

```
import {myHelperFunction} from './helpers';

describe('myHelperFunction', () => {
    it('should help me!', () => {
        const result = myHelperFunction();
        expect(result).toEqual("You've been helped!!");
    });
});
```

## Integration Tests for React Components
Test react components along with the hooks and actions they use by using `renderWithProviders` from [test-utils](../testing/test-utils.tsx). `renderWithProviders` will wrap the component you are testing with the redux store provider and optionally a pre-loaded state that you supply. Because these are integration tests, we should also check that side effects of our component, such as updates to redux store data, have occurred correctly. For example:
```
describe('App component', () => {
  it('should render react learning link and get the logged-in user information', async () => {
    const { getByText, store } = renderWithProviders(<App />)
    expect(getByText(/learn/i)).toBeInTheDocument();
    await waitFor(() => expect(sepAPI.endpoints.getUser.select('me')(store.getState()).data?.id).toEqual(globals.loggedInUserID));
  });
});
```
Because the entire test suite is setup with an express server and database via [test-env-setup.ts](../testing-test-env-setup.backend.ts), we can allow the frontend components and actions to make HTTP requests to the backend. It is not necessary to mock child components or Redux/RTK hooks in component tests, since these are intended to be integration tests. HTTP requests to the backend do not need to be mocked either, since even the frontend tests run with a connected backend and database. HTTP requests to 3rd party API's, however, should be mocked using [msw](https://www.npmjs.com/package/msw).

## Integration Tests for Redux Slices and RTK Query APIs
### Redux Slices
For Redux Slices, we want to ensure that all reducers, extra reducers, and async thunks are properly tested. The general process for testing a slice is:
* Setup a store (usually in a beforeEach() call)
* Dispatch an action
* Check the values in the store to ensure the action and reducer fired and made mutations as expected.
* For async thunks, the pending, fulfilled, and rejected states should be tested. 

Here's an example:
```
describe('counterSlice', () => {
  let store: AppStore;
  const initialState: CounterState = {
    value: 3,
    status: 'idle',
  };

  beforeEach(() => {
    store = setupStore();
  });

  it('should handle increment', () => {
    const actual = counterReducer(initialState, increment());
    expect(actual.value).toEqual(4);
  });
  describe('incrementAsync', () => {
    it('should set status to "loading" when pending', async () => {
      Promise.resolve()
      const pendingIncrementAsync = createAsyncThunk(
        'counter/incrementAsync',
        async () => {
          return new Promise(() => { });
        }
      );
      store.dispatch(pendingIncrementAsync());
      const status = store.getState().counter.status
      expect(status).toEqual('loading');
    });  
    it('should update the count and status when fulfilled', async () => {
      const amount = 10;
      await store.dispatch(incrementAsync(amount));
      const count = store.getState().counter.value
      expect(count).toEqual(amount);
      expect(selectCount(store.getState())).toEqual(amount);
      expect(store.getState().counter.status).toEqual('idle');
    });
    it('should set status to "failed" when rejected', async () => {
      const rejectedIncrementAsync = createAsyncThunk(
        'counter/incrementAsync',
        async () => {
          throw Error()
        }
      );
      await store.dispatch(rejectedIncrementAsync());
      const status = store.getState().counter.status
      expect(status).toEqual('failed');
    });
  });

});

```
### RTK Query APIs
RTK Query handles all of the fulfilled, rejected, and pending states of our async thunks when we create an RTK Query API. Therefore, we only need to test that our fulfilled requests are getting and/or updating the correct data, along with any side effects (such as [invalidating tags](https://redux-toolkit.js.org/rtk-query/usage/automated-refetching#invalidating-tags)). For example:
```
describe('sepAPI', () => {
    let store: AppStore;
    beforeEach(() => {
        store = setupStore();
    });
    it('should handle getUser', async () => {
        const result = await store.dispatch(sepAPI.endpoints.getUser.initiate(globals.loggedInUserID));
        expect(result.status).toBe('fulfilled');
        expect(result.data?.id).toBe(globals.loggedInUserID);
    });
});
```

## Integration Tests for Backend Endpoints
The backend endpoints are tested (with all middleware, etc) using Supertest. Calls to external 3rd party APIs should be mocked using [msw](https://www.npmjs.com/package/msw). 

```
it('should successfully return a user ', async () => {
    const response = await globals.request
      .get(`/users/abc`)
      .expect(200);
    expect(response.body.id).toEqual('abc');
});
```
```globals.db``` can be used to query the database to ensure that records were properly updated:
```
const response = await globals.request
  .patch(`/users/${globals.loggedInUserID}`)
  .send({ surname: 'Falafel' })
  .expect(200);
expect(response.body.surname).toEqual('Falafel');
expect((await globals.db.User.findByPk(globals.loggedInUserID)).surname).toEqual('Falafel');
```

## E2E Tests for Main User Flows

Todo... but will likely entail just mounting the entire application and clicking through the main user flows with Testing Library.