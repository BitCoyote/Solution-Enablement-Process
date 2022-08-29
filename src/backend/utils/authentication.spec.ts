import { SuperTest, Test } from 'supertest';
import * as authentication from './authentication';
import * as msal from "@azure/msal-node";
const globals = globalThis as any;
const clientConfig = {
    auth: {
        clientId: process.env.REACT_APP_CLIENT_ID as string,
        authority: `https://login.microsoftonline.com/${process.env.REACT_APP_TENANT_ID as string}`,
    }
};
const pca = new msal.PublicClientApplication(clientConfig);
const msalTokenCache = pca.getTokenCache();

const getTestUserTokens = async () => {
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
describe('authentication middleware', () => {
    it('should skip authentication if the user is viewing the api documentation', async () => {
        await (globals.request as SuperTest<Test>)
            .get(`/api-docs`)
            .expect(301);
    });
    it('should skip token validation when process.env.BYPASS_AUTH is true', async () => {
        process.env.BYPASS_AUTH = 'true';
        const validateToken = jest.spyOn(authentication, 'validateToken');
        await (globals.request as SuperTest<Test>)
            .get(`/users/me`)
            .expect(200);
        expect(validateToken).not.toHaveBeenCalled()
    });
    it('should not skip token validation when process.env.BYPASS_AUTH is false', async () => {
        process.env.BYPASS_AUTH = 'false';
        const validateToken = jest.spyOn(authentication, 'validateToken');
        const tokens = await getTestUserTokens();
        await (globals.request as SuperTest<Test>)
            .get(`/users/me`)
            .set('Authorization', `Bearer ${tokens?.idToken}`)
            .expect(200);
        expect(validateToken).toHaveBeenCalled();
        // reset to true
        process.env.BYPASS_AUTH = 'true';
    });
    it('should attach the user roles and permissions to res.locals.user', async () => {
        // create a fake route just to check for res.locals
        globals.app.get('/somefakeroute', (req: Express.Request, res: any) => {
            return res.send(res.locals.user);
        });
        const response = await (globals.request as SuperTest<Test>)
            .get(`/somefakeroute`)
            .expect(200);
        expect(response.body.oid).toEqual(globals.loggedInUserID);
        expect(response.body.roles).toBeDefined();
        expect(response.body.roles[0].permissions).toBeDefined();
    });
    it('should return a 401 error if the user cannot be authenticated', async () =>{
        await (globals.request as SuperTest<Test>)
            .get(`/users/me`)
            .set('Authorization', 'Bearer thisisnotavalidtoken')
            .expect(401);
    });
    describe('for the /users/me path', ()=> {
        it('should update the user data when the user already exists in the database', async () => {
            await (globals.request as SuperTest<Test>)
            .get(`/users/me`)
            .expect(200);
            const user = await globals.db.User.findByPk(globals.loggedInUserID);
            // We know the model has been updated if the createdAt and updatedAt times are not equal, because the database is seeded at the start of every test.
            expect(user.createdAt).not.toEqual(user.updatedAt);
        });    
        it('should create a user when the user does not exist in the database', async () => {
            // This is for pmalone@y4tk2.onmicrosoft.com, which is a user that does not exist in mock-db.ts
            const unexistingUserToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IjJaUXBKM1VwYmpBWVhZR2FYRUpsOGxWMFRPSSJ9.eyJhdWQiOiI0NWNiMzU1NS1hZDdjLTQwYWQtYWQ0OC0zMTQ0MjhkZDJiMjgiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vM2RjN2E4ZDMtMmRiYS00NDQ4LWFkZDItZmJkOTNmMDhmYTRmL3YyLjAiLCJpYXQiOjE2NjE3OTAwMTMsIm5iZiI6MTY2MTc5MDAxMywiZXhwIjoxNjYxNzkzOTEzLCJlbWFpbCI6InBtYWxvbmVAeTR0azIub25taWNyb3NvZnQuY29tIiwiZmFtaWx5X25hbWUiOiJNYWxvbmUiLCJnaXZlbl9uYW1lIjoiUG9zdCIsIm5hbWUiOiJQb3N0IE1hbG9uZSIsIm9pZCI6ImNhYzY1NzQyLTAyZDgtNDkwMC1iZWQyLTU5M2MxYjIzNGRkOSIsInByZWZlcnJlZF91c2VybmFtZSI6InBtYWxvbmVAeTR0azIub25taWNyb3NvZnQuY29tIiwicmgiOiIwLkFYMEEwNmpIUGJvdFNFU3QwdnZaUHdqNlQxVTF5MFY4cmExQXJVZ3hSQ2pkS3lpY0FOOC4iLCJzdWIiOiJUWmhqcjdNVk5BZHhyeFF1REZUZ1pSUjNHLWhLSGtBOVhxY2duaDhPYnhNIiwidGlkIjoiM2RjN2E4ZDMtMmRiYS00NDQ4LWFkZDItZmJkOTNmMDhmYTRmIiwidXRpIjoiRmNSVHJqai14MFNjWWJmQ0hRNHZBQSIsInZlciI6IjIuMCJ9.FafGh6ZZmmdGgypU8AaLGEhaLFSZmF7yzECbqMq3IboqN57ef8FjU9hXORHNTAn74WnzcZr07D9ycROGgTW0W8yrZ0AQRY1Uejbf-2Gu6C_iTQP5iWuDoQp8C3gfNpqbiZb9v-UO-IrEdSIZ-SIttRaGhBFlw6Nhf9WJ6qLw2BHRFyeB-HQ1hI3pvNRHhbj3K-B9GFM9-7onqeHSgB6GjCoRI1M4lOaR-SDTScac8fVZoRNPF15yCjWeKGv3hwCjz0zMlsSluIjZ5QDuHv3sNLDSlKrD7hvLti2sB-_OFQO_8sLcuBSlDPKcZ8thviGqNUmX1RPLQBKILBJgb8Xb4g';
            const unexistingUserID = 'cac65742-02d8-4900-bed2-593c1b234dd9';
            await (globals.request as SuperTest<Test>)
            .get(`/users/me`)
            .set('Authorization', `Bearer ${unexistingUserToken}`)
            .expect(200);
            const user = await globals.db.User.findByPk(unexistingUserID);
            // We know the model has just been created if the createdAt and updatedAt times are equal.
            expect(user.createdAt).toEqual(user.updatedAt);

        });    
    })
});