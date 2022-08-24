import express from 'express';
import mockDB from './utils/mocks/mock-db';
import authentication from './utils/authentication';
import routes from './routes';
import * as msal from "@azure/msal-node";
import supertest from 'supertest';

require('dotenv').config({ path: '.env.testing' })

const clientConfig = {
    auth: {
        clientId: process.env.REACT_APP_CLIENT_ID as string,
        authority: `https://login.microsoftonline.com/${process.env.REACT_APP_TENANT_ID as string}`,
    }
};
const pca = new msal.PublicClientApplication(clientConfig);
const msalTokenCache = pca.getTokenCache();

export const getTestUserTokens = async () => {
    async function getAccounts() {
        return await msalTokenCache.getAllAccounts();
    };

    const accounts = await getAccounts();

    // Acquire Token Silently if an account is present
    if (accounts.length > 0) {
        const silentRequest = {
            account: accounts[0], // Index must match the account that is trying to acquire token silently
            scopes: ["user.read"],
        };

        return pca.acquireTokenSilent(silentRequest).catch((error) => {
            console.log(error);
        });
    } else { // fall back to username password if there is no account
        const usernamePasswordRequest = {
            scopes: ["user.read"],
            username: process.env.TESTING_USER as string,
            password: process.env.TESTING_PASS as string,
        };

        return pca.acquireTokenByUsernamePassword(usernamePasswordRequest).catch((error) => {
            console.log(error);
        });
    }
}

const globals = globalThis as any;
// Mock logger util so we don't spit out error logs to stdout on every test
jest.mock('./utils/logger.ts', () => ({
    debug: jest.fn(),
    error: jest.fn(),
    info: jest.fn()
}));

beforeAll(async () => {
    // Get tokens for testing user and attach to globals. This beforeAll hook runs at the beginning of each file
    globals.tokens = await getTestUserTokens();
});

beforeEach(() => {
    // Before every test, set up an express application and mock database. 
    const app = express();
    const db = mockDB();
    const authDB = mockDB();
    // Mock User.findOne for call in authentication middleware. Return user from token.
    authDB.User.findOne = jest.fn().mockReturnValueOnce({ id: globals.tokens.idTokenClaims.oid, lastActiveDirectoryUpdate: Date.now(), displayName: globals.tokens.idTokenClaims.name });
    app.use((req, res, next) => authentication(req, res, next, authDB));
    routes(app, db);
    // Apply app and db to globals to allow for use in test files.
    globals.app = app;
    globals.db = db;

    // Create a custom wrapper on supertest so 
    const hook = (method = 'get') => (args: any[]) => {
        //@ts-ignore
        return supertest(app)[method](args).set('Authorization', `Bearer ${globals.tokens.idToken}`)
    };
    globals.request = {
        post: hook('post'),
        get: hook('get'),
        put: hook('put'),
        delete: hook('delete'),
        patch: hook('patch')
    } as unknown as supertest.SuperTest<supertest.Test>
});
