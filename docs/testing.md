# Testing

The testing in this project can be broken down into the following:

* **Static Analysis** - Typescript, tslint, and eslint will catch typos and type errors as we write and commit code.
* **Unit Tests** - Generally for one-off functions such as things such as helpers/utils, redux slices, and files in the [shared](src/shared) directory using Jest.
* **Integration Tests** - For testing functionality that spans multiple files. 
 * For the frontend, this is mainly component testing using Jest and Testing Library.
 * For the backend, this is mainly endpoint testing using Jest and Supertest.
* **End-to-End (E2E) Tests** - For testing the main user flows of the application as a whole, using Cypress.

[More reading on testing](https://kentcdodds.com/blog/static-vs-unit-vs-integration-vs-e2e-tests)

## Running Unit & Integration Tests with Jest

* To run the entire test suite use `npm run test`.
    * To run only the frontend tests, use `npm run test-frontend`.
    * To run only the backend tests, use `npm run test-backend`.
    * To run only the shared tests, use `npm run test-shared`.
    
[jest.config.js](jest.config.js) is configured with multiple projects, allowing us to run tests in different jest environments (`node` for the backend and shared tests, `jsdom` for the frontend tests). The entire test suite will be reported to the `/coverage` folder (git-ignored) when using `npm run test`.

## Coverage
We want to have test coverage for the following:
* Utils/helpers/one-off functions (unit)
* Redux slices (unit)
* Backend endpoints (integration)
* React components (integration)
* Main user flows (e2e)

## Writing Integration Tests for Backend Endpoints

The backend endpoints are tested (with all middleware, authentication, etc) using Supertest. We mock database calls because starting, migrating, and seeding a database for every test file would take too much time to reasonably run before commits and in a CI/CD pipeline. The backend tests are preconfigured from [src/backend/test-setup.ts](src/backend/test-setup.ts). At the start of each testing file, the test runner will automatically authenticate with Azure AD using the `TESTING_USER` and `TESTING_PASS` defined in `.env.testing`. The tokens received will automatically be applied when using `globals.request`. For example:
```
import {SuperTest, Test} from 'supertest';
describe('User module', () => {
  const globals = globalThis as any;
  describe('GET /users/{id}', () => {
    it('should successfully return a user ', async () => {
      const user = { id: 'blorg' };
      // Mock the sequelize database findOne function
      const mockFindOne = jest.fn();
      mockFindOne.mockReturnValue(user);
      globals.db.User.findOne = mockFindOne;
      // We are actually hitting this endpoint with and of the authentication middleware!
      await (globals.request as SuperTest<Test>)
        .get(`/users/me`)
        .expect(user)
        .expect(200)
    });
  });
});

```
This preconfiguration means when using `globals.request`, we do not need to bootstrap an express application and attach a token for every test.
