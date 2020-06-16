export const OAUTH_MODULE_OPTIONS = 'OAUTH_MODULE_OPTIONS';
export const service = 'oauthService';
export const loginUrl = 'getLoginUrl';
export const user = 'getUser';
export const github = {
  loginUrl: 'https://github.com/login/oauth/authorize',
  userUrl: 'https://api.github.com/user',
  tokenUrl: 'https://github.com/login/oauth/access_token',
};
export const google = {
  loginUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
  userUrl: 'https://www.googleapis.com/userinfo/v2/me',
  tokenUrl: 'https://oauth2.googleapis.com/token',
};
export const JSONHeader = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};
export const oauth = {
  access: 'access_type',
  scope: 'scope',
  response: 'response_type',
  id: 'client_id',
  secret: 'client_secret',
  prompt: 'prompt',
  auth: 'authorization_code',
  redirect: 'redirect_uri',
  includeScopes: 'include_granted_scoped',
  loginHint: 'login_hint',
  state: 'state',
};
export const code = 'code';
