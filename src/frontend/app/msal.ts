import {
  Configuration,
  PublicClientApplication,
  SilentRequest,
} from '@azure/msal-browser';

const msalConfig: Configuration = {
  auth: {
    clientId: process.env.REACT_APP_CLIENT_ID as string,
    authority: `https://login.microsoftonline.com/${process.env.REACT_APP_TENANT_ID}`,
    redirectUri: process.env.REACT_APP_REDIRECT_URI as string,
  },
};
const pca = new PublicClientApplication(msalConfig);

/** This defines the scopes requested from Azure AD */
export const authRequest: SilentRequest = {
  scopes: ['openid', 'profile'],
};

export default pca;
