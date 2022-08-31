import axios, { AxiosRequestConfig } from 'axios';
import { FrontendTestingGlobals } from './types';

require('dotenv').config({ path: '.env.testing' })

// Fake expired token used alongside BYPASS_AUTH env variable. For user ID 774d6f78-5477-4f71-8f6e-fea599577a50
const fakeIdToken = `eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IjJaUXBKM1VwYmpBWVhZR2FYRUpsOGxWMFRPSSJ9.eyJhdWQiOiI0NWNiMzU1NS1hZDdjLTQwYWQtYWQ0OC0zMTQ0MjhkZDJiMjgiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vM2RjN2E4ZDMtMmRiYS00NDQ4LWFkZDItZmJkOTNmMDhmYTRmL3YyLjAiLCJpYXQiOjE2NjEzOTkwMzksIm5iZiI6MTY2MTM5OTAzOSwiZXhwIjoxNjYxNDAyOTM5LCJuYW1lIjoiSm9yZGFuIENhdWRpbGwiLCJub25jZSI6ImExNjQ4N2U2LTE2Y2QtNGY2Zi1hMGZhLThkZGIxMjhjODBiMCIsIm9pZCI6Ijc3NGQ2Zjc4LTU0NzctNGY3MS04ZjZlLWZlYTU5OTU3N2E1MCIsInByZWZlcnJlZF91c2VybmFtZSI6ImplZy1hZG1pbkB5NHRrMi5vbm1pY3Jvc29mdC5jb20iLCJyaCI6IjAuQVgwQTA2akhQYm90U0VTdDB2dlpQd2o2VDFVMXkwVjhyYTFBclVneFJDamRLeWljQUlnLiIsInN1YiI6IkZLN1hULU5YRGJfblZ1NTlVd2I1THVXWDdFczdNRXE5SzBySlBDZHR4VUUiLCJ0aWQiOiIzZGM3YThkMy0yZGJhLTQ0NDgtYWRkMi1mYmQ5M2YwOGZhNGYiLCJ1dGkiOiJOWG94bXBlMDNVV21hd0dtSmxJaEFBIiwidmVyIjoiMi4wIn0.WHBXBPfNu-CQKqVDMyVHU0PmQVOQM5Qcz8XRtJwYLpzxvF88-s206kSUqnSHoa5RD2Y4wZvehegTuy_D-CuqfL9YjRjpbIXtn50oxyJnNkznMVI_RI9WTzadO24pPxhszklQTobu6jMCxAuIZwArd1eOJTBF4vB04pzD-xcUq-XPgg9gG7ZBfb5DJ0NRIYO6Ld9xKes0HtyZ5hKZu8VNknZvPvM5OvgyYq4tuCo3ZnMlcfjVZw0hVKKNibEHHNktejkq4D1x0O2CoFuYIMDw1ATJ6Cq2zCpsmAlTfmPXGzEiICUYT4iuBvpdpMZTe_Om0MEuFMLybMIaUF4pXI8fhg`;
const loggedInUserID = '774d6f78-5477-4f71-8f6e-fea599577a50';
const globals = globalThis as unknown as FrontendTestingGlobals
beforeEach(async () => {
    await globals.setupApp();
    globals.loggedInUserID = loggedInUserID;

    // Reassign REACT_APP_API_BASE_URL to use the port determined in the custom-env.frontend.ts
    process.env.REACT_APP_API_BASE_URL = `http://localhost:${globals.port}`
    axios.interceptors.request.use(
        (config: AxiosRequestConfig) => {
            if (
                config.url &&
                (config.url.startsWith(
                    process.env.REACT_APP_API_BASE_URL as string
                ))
            ) {
                config.headers = config.headers || {};
                config.headers['Content-Type'] = 'application/json';
                config.headers.Authorization = `Bearer ${fakeIdToken}`;
            }
            return config;
        }
    );
});

afterEach(async()=> {
    await globals.teardownApp();
})