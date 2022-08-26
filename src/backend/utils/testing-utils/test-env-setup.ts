import { createApp } from '../../../backend/index';
import supertest from 'supertest';
import { seedTables } from '../mocks/mock-db';
require('dotenv').config({ path: '.env.testing' })

// Fake expired token used alongside BYPASS_AUTH env variable. For user ID 774d6f78-5477-4f71-8f6e-fea599577a50
const fakeIdToken = `eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IjJaUXBKM1VwYmpBWVhZR2FYRUpsOGxWMFRPSSJ9.eyJhdWQiOiI0NWNiMzU1NS1hZDdjLTQwYWQtYWQ0OC0zMTQ0MjhkZDJiMjgiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vM2RjN2E4ZDMtMmRiYS00NDQ4LWFkZDItZmJkOTNmMDhmYTRmL3YyLjAiLCJpYXQiOjE2NjEzOTkwMzksIm5iZiI6MTY2MTM5OTAzOSwiZXhwIjoxNjYxNDAyOTM5LCJuYW1lIjoiSm9yZGFuIENhdWRpbGwiLCJub25jZSI6ImExNjQ4N2U2LTE2Y2QtNGY2Zi1hMGZhLThkZGIxMjhjODBiMCIsIm9pZCI6Ijc3NGQ2Zjc4LTU0NzctNGY3MS04ZjZlLWZlYTU5OTU3N2E1MCIsInByZWZlcnJlZF91c2VybmFtZSI6ImplZy1hZG1pbkB5NHRrMi5vbm1pY3Jvc29mdC5jb20iLCJyaCI6IjAuQVgwQTA2akhQYm90U0VTdDB2dlpQd2o2VDFVMXkwVjhyYTFBclVneFJDamRLeWljQUlnLiIsInN1YiI6IkZLN1hULU5YRGJfblZ1NTlVd2I1THVXWDdFczdNRXE5SzBySlBDZHR4VUUiLCJ0aWQiOiIzZGM3YThkMy0yZGJhLTQ0NDgtYWRkMi1mYmQ5M2YwOGZhNGYiLCJ1dGkiOiJOWG94bXBlMDNVV21hd0dtSmxJaEFBIiwidmVyIjoiMi4wIn0.WHBXBPfNu-CQKqVDMyVHU0PmQVOQM5Qcz8XRtJwYLpzxvF88-s206kSUqnSHoa5RD2Y4wZvehegTuy_D-CuqfL9YjRjpbIXtn50oxyJnNkznMVI_RI9WTzadO24pPxhszklQTobu6jMCxAuIZwArd1eOJTBF4vB04pzD-xcUq-XPgg9gG7ZBfb5DJ0NRIYO6Ld9xKes0HtyZ5hKZu8VNknZvPvM5OvgyYq4tuCo3ZnMlcfjVZw0hVKKNibEHHNktejkq4D1x0O2CoFuYIMDw1ATJ6Cq2zCpsmAlTfmPXGzEiICUYT4iuBvpdpMZTe_Om0MEuFMLybMIaUF4pXI8fhg`;
const loggedInUserID = '774d6f78-5477-4f71-8f6e-fea599577a50';
const globals = globalThis as any;
const port = process.env.SQL_SERVER_PORT || 3001;

// Mock logger util so we don't spit out error logs to stdout on every test
jest.mock('../logger.ts', () => ({
    debug: jest.fn(),
    error: jest.fn(),
    info: jest.fn()
}));

beforeEach(async () => {
    const { app, db } = await createApp();
    globals.app = app;
    globals.db = db;
    globals.loggedInUserID = loggedInUserID;
    // Create server on port so frontend tests can hit the backend api 
    globals.server = await app.listen(port);

    await globals.db.sequelize.sync({ force: true }).catch((err: any) => console.warn(err));
    await seedTables(globals.db);
    const hook = (method = 'get') => (args: any[]) => {
        // Create hook to automatically use express app created above, and apply the Authorization header to every request.
        // @ts-ignore
        return supertest(globals.app)[method](args).set('Authorization', `Bearer ${fakeIdToken}`);
    };
    globals.request ={
            post: hook('post'),
            get: hook('get'),
            put: hook('put'),
            delete: hook('delete'),
            patch: hook('patch')
    };
});

afterEach(async () => {
    // Close our express server at the end of each test.
    await globals.server.close();
})

