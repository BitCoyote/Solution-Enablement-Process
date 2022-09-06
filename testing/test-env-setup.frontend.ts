import axios, { AxiosRequestConfig } from 'axios';
import { FrontendTestingGlobals } from './types';

require('dotenv').config({ path: '.env.testing' })

// Fake expired token used alongside BYPASS_AUTH env variable. For user ID 774d6f78-5477-4f71-8f6e-fea599577a50
const fakeIdToken = `eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IjJaUXBKM1VwYmpBWVhZR2FYRUpsOGxWMFRPSSJ9.eyJhdWQiOiI0NWNiMzU1NS1hZDdjLTQwYWQtYWQ0OC0zMTQ0MjhkZDJiMjgiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vM2RjN2E4ZDMtMmRiYS00NDQ4LWFkZDItZmJkOTNmMDhmYTRmL3YyLjAiLCJpYXQiOjE2NjEzOTkwMzksIm5iZiI6MTY2MTM5OTAzOSwiZXhwIjoxNjYxNDAyOTM5LCJuYW1lIjoiSm9yZGFuIENhdWRpbGwiLCJub25jZSI6ImExNjQ4N2U2LTE2Y2QtNGY2Zi1hMGZhLThkZGIxMjhjODBiMCIsIm9pZCI6Ijc3NGQ2Zjc4LTU0NzctNGY3MS04ZjZlLWZlYTU5OTU3N2E1MCIsInByZWZlcnJlZF91c2VybmFtZSI6ImplZy1hZG1pbkB5NHRrMi5vbm1pY3Jvc29mdC5jb20iLCJyaCI6IjAuQVgwQTA2akhQYm90U0VTdDB2dlpQd2o2VDFVMXkwVjhyYTFBclVneFJDamRLeWljQUlnLiIsInN1YiI6IkZLN1hULU5YRGJfblZ1NTlVd2I1THVXWDdFczdNRXE5SzBySlBDZHR4VUUiLCJ0aWQiOiIzZGM3YThkMy0yZGJhLTQ0NDgtYWRkMi1mYmQ5M2YwOGZhNGYiLCJ1dGkiOiJOWG94bXBlMDNVV21hd0dtSmxJaEFBIiwidmVyIjoiMi4wIn0.WHBXBPfNu-CQKqVDMyVHU0PmQVOQM5Qcz8XRtJwYLpzxvF88-s206kSUqnSHoa5RD2Y4wZvehegTuy_D-CuqfL9YjRjpbIXtn50oxyJnNkznMVI_RI9WTzadO24pPxhszklQTobu6jMCxAuIZwArd1eOJTBF4vB04pzD-xcUq-XPgg9gG7ZBfb5DJ0NRIYO6Ld9xKes0HtyZ5hKZu8VNknZvPvM5OvgyYq4tuCo3ZnMlcfjVZw0hVKKNibEHHNktejkq4D1x0O2CoFuYIMDw1ATJ6Cq2zCpsmAlTfmPXGzEiICUYT4iuBvpdpMZTe_Om0MEuFMLybMIaUF4pXI8fhg`;
const fakeAccessToken = `eyJ0eXAiOiJKV1QiLCJub25jZSI6IkpHeVdXVUhoaVVsQjBvSDVsSi1mSUVxcW4tdVNMNFNYTjJrc1F2eDkyRzQiLCJhbGciOiJSUzI1NiIsIng1dCI6IjJaUXBKM1VwYmpBWVhZR2FYRUpsOGxWMFRPSSIsImtpZCI6IjJaUXBKM1VwYmpBWVhZR2FYRUpsOGxWMFRPSSJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC8zZGM3YThkMy0yZGJhLTQ0NDgtYWRkMi1mYmQ5M2YwOGZhNGYvIiwiaWF0IjoxNjYyMDYxNDA4LCJuYmYiOjE2NjIwNjE0MDgsImV4cCI6MTY2MjA2NjE1OSwiYWNjdCI6MCwiYWNyIjoiMSIsImFpbyI6IkFWUUFxLzhUQUFBQTB0RG93LzJwcU1kbkJVcFJTVkZVOUYweVdYRUxiK3dNNmVzMzEwdkNvWXQ0Z0xCVHJORXBScG5ZUkxESnY3aE1DYnFLOTdCUHkvTzVWYmZSL2NLRjVOcVozVk00anhnMW55YUtsM1lWRy93PSIsImFtciI6WyJwd2QiLCJtZmEiXSwiYXBwX2Rpc3BsYXluYW1lIjoiSkVHIiwiYXBwaWQiOiI0NWNiMzU1NS1hZDdjLTQwYWQtYWQ0OC0zMTQ0MjhkZDJiMjgiLCJhcHBpZGFjciI6IjAiLCJmYW1pbHlfbmFtZSI6IkNhdWRpbGwiLCJnaXZlbl9uYW1lIjoiSm9yZGFuIiwiaWR0eXAiOiJ1c2VyIiwiaXBhZGRyIjoiNDcuMTg4LjkwLjExNyIsIm5hbWUiOiJKb3JkYW4gQ2F1ZGlsbCIsIm9pZCI6Ijc3NGQ2Zjc4LTU0NzctNGY3MS04ZjZlLWZlYTU5OTU3N2E1MCIsInBsYXRmIjoiMyIsInB1aWQiOiIxMDAzMjAwMjE5RjI1RTdCIiwicmgiOiIwLkFYMEEwNmpIUGJvdFNFU3QwdnZaUHdqNlR3TUFBQUFBQUFBQXdBQUFBQUFBQUFDY0FJZy4iLCJzY3AiOiJlbWFpbCBwcm9maWxlIFVzZXIuUmVhZCBvcGVuaWQiLCJzdWIiOiJrb1Y0WEdZLXVNcDdNekM0ZFZ2eWNyamFncWVuemxna3FwZ1VRbXBDQXUwIiwidGVuYW50X3JlZ2lvbl9zY29wZSI6Ik5BIiwidGlkIjoiM2RjN2E4ZDMtMmRiYS00NDQ4LWFkZDItZmJkOTNmMDhmYTRmIiwidW5pcXVlX25hbWUiOiJqZWctYWRtaW5AeTR0azIub25taWNyb3NvZnQuY29tIiwidXBuIjoiamVnLWFkbWluQHk0dGsyLm9ubWljcm9zb2Z0LmNvbSIsInV0aSI6IklXRk9jYWFsZ0VxMmNIaGs2LVNlQUEiLCJ2ZXIiOiIxLjAiLCJ3aWRzIjpbIjYyZTkwMzk0LTY5ZjUtNDIzNy05MTkwLTAxMjE3NzE0NWUxMCIsImI3OWZiZjRkLTNlZjktNDY4OS04MTQzLTc2YjE5NGU4NTUwOSJdLCJ4bXNfc3QiOnsic3ViIjoiRks3WFQtTlhEYl9uVnU1OVV3YjVMdVdYN0VzN01FcTlLMHJKUENkdHhVRSJ9LCJ4bXNfdGNkdCI6MTY1OTgyOTc1N30.lLeocFGYbfMDyhlhDn6TUmscQGi8RzkeOiK13gDM2fpaBdprvgtbmxrdkSpPwWIAAVWl-NTEizSq5HUHCbTo1U5AmLffHCow64aSUcnp-qXrsEY-1edkmUzllFf7BBdrba0W6Rmoh28gIxRaXzo6fhzYj0SdaQD-8k-yKZ_rziJMai0DhIHJ5gvB0n77CaCLxPbLBUxUnvXHgHxAXXh51s0b8GWKTNYPWyAc_vDxUlGTswFQMj7NfNcUOFtt_SxcLw07Mj7d2YX3Nj7I00uwdgJXnSImfOvDDokdaaIHDNjAY7fvLNhf2r69tvpxnPj3iVqYtsi7YZ52-C8BlMZVsg`;
const loggedInUserID = '774d6f78-5477-4f71-8f6e-fea599577a50';
const globals = globalThis as unknown as FrontendTestingGlobals
beforeEach(async () => {
    await globals.setupApp();
    globals.loggedInUserID = loggedInUserID;
    globals.idToken = fakeIdToken;
    globals.accessToken = fakeAccessToken;
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