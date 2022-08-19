import { createUserManager } from 'redux-oidc';

export const tenantId = process.env.REACT_APP_TENANT_ID;
const appId = process.env.REACT_APP_CLIENT_ID;
export const loginDomain = 'https://login.microsoftonline.com';
const authURLBase = `${loginDomain}/${tenantId}/v2.0`;

const userManagerConfig = {
  client_id: appId, // eslint-disable-line camelcase
  redirect_uri: process.env.REACT_APP_REDIRECT_URI, // eslint-disable-line camelcase
  response_mode: 'query', // eslint-disable-line camelcase
  response_type: 'code', // eslint-disable-line camelcase
  scope: `openid profile`,
  authority: `${authURLBase}/.well-known/openid-configuration?appid=${appId}`,
  silent_redirect_uri: process.env.REACT_APP_SILENT_REDIRECT_URI, // eslint-disable-line camelcase
  automaticSilentRenew: true,
  filterProtocolClaims: true,
  loadUserInfo: false
};

const userManager = createUserManager(userManagerConfig);

export default userManager;
