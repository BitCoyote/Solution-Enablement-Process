import {
    UserState,
    USER_FOUND,
    USER_EXPIRED,
    SILENT_RENEW_ERROR,
    reducer
} from 'redux-oidc';
import axios, {  AxiosRequestConfig } from 'axios';
import userManager from './userManager';
import { RootState } from '../store';
import { User } from 'oidc-client';
let silentSignInPromise: any = null;
let idTokenRefreshInterval: NodeJS.Timer | null = null;
let interceptor: number;
/**
 *  A wrapper around the redux-oidc reducer in order to apply auth headers and handle silent renew redirects if silent renew fails. 
 * This purposely uses the old "switch" statement reducer format for compatiblity with redux-oidc. 
 */
export default function customOidcReducer(
    state = { isLoadingUser: false },
    action: any
): UserState {
    switch (action.type) {
        case USER_FOUND:
            // If we have a previous request interceptor, we want to remove it so we can replace it with a new interceptor with new tokens.
            interceptor !== undefined &&
                axios.interceptors.request.eject(interceptor);
            interceptor = axios.interceptors.request.use(
                setUserHeaders(action.payload)
            );

            // Set up a response interceptor that will refresh the id token if a 401 is returned. redux-oidc only silently renews the access token.
            axios.interceptors.response.use(res => res, failedResponseInterceptor);

            // Clear any old idTokenRefreshInterval
            if (idTokenRefreshInterval) {
                clearInterval(idTokenRefreshInterval);
            }
            const idToken = parseJWT(action.payload.id_token);
            // Every 4 minutes, check if our id token is within 5 minutes of expiring.
            idTokenRefreshInterval = setInterval(() => {
                if (idToken.exp - Math.ceil(Date.now() / 1000) < 300) {
                    silentSignInPromise = userManager
                        .signinSilent({
                            state: {
                                originalUrl: window.location.pathname
                            }
                        })
                        .then(() => {
                            silentSignInPromise = null;
                        })
                        .catch(() => {
                            userManager.signinRedirect({
                                state: {
                                    originalUrl: window.location.pathname
                                }
                            });
                        });
                }
            }, 240000);
            break;
        case SILENT_RENEW_ERROR:
        case USER_EXPIRED:
            if (!state.isLoadingUser) {
                userManager.signinRedirect({
                    state: {
                        originalUrl: window.location.pathname
                    }
                });
            }
            break;
        default:
            break;
    }
    return reducer(state, action);
}

/** Sets request headers for requests to our API */
export const setUserHeaders = (user: User) => (config: AxiosRequestConfig) => {
    if (
        config.url &&
        (config.url.startsWith(
            process.env.REACT_APP_API_BASE_URL as string
        ))
    ) {
        config.headers = config.headers || {};
        config.headers['Content-Type'] = 'application/json';
        config.headers.Authorization = `Bearer ${user.id_token || ''}`;
        config.headers.access_token = user.access_token || ''; // eslint-disable-line camelcase
    }
    return config;
};
/** If a request to our API fails with a 401 (Unauthorized), refresh the token and try one more time */
export const failedResponseInterceptor = (error: any) => {

    if (
        error.response &&
        error.response.status === 401 &&
        error.config.url.indexOf(process.env.REACT_APP_API_BASE_URL) === 0 &&
        !error.config.isRetry
    ) {
        if (silentSignInPromise) {
            return silentSignInPromise.then((userRes: User) => {
                return retryRequest(error, userRes);
            });
        } else {
            silentSignInPromise = userManager
                .signinSilent({
                    state: {
                        originalUrl: window.location.pathname
                    }
                })
                .then(userRes => {
                    silentSignInPromise = null;
                    return retryRequest(error, userRes);
                });
            return silentSignInPromise;
        }
    }
    return Promise.reject(error);
};
/** Retry a failed request. Sets config.isRetry to true, so failedResponseInterceptor will not retry more than once. */
const retryRequest = (error: any, userRes: User) => {
    error.config.headers['Authorization'] = 'Bearer ' + userRes.id_token;
    error.config.headers['access_token'] = userRes.access_token;
    // Set isRetry=true so that we don't create an infinite request loop if the retry fails.
    error.config.isRetry = true;
    return axios.request(error.config);
};
/** Parses a JSON web token to return the JSON data contained within */
const parseJWT = (token: string) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
        atob(base64)
            .split('')
            .map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join('')
    );

    return JSON.parse(jsonPayload);
};

export const selectOidcUser = (state: RootState) => state.oidc.user;
export const selectOidcUserLoading = (state: RootState) => state.oidc.isLoadingUser;
