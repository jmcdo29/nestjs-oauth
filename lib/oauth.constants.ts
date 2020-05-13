export const OAUTH_MODULE_OPTIONS = 'OAUTH_MODULE_OPTIONS';
export const service = 'oauthService';
export const loginUrl = 'getLoginUrl';
export const user = 'getUser';
export const google = {
  loginUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
  userUrl: 'https://www.googleapis.com/userinfo/v2/me',
  tokenUrl: 'https://oauth2.googleapis.com/token'
}
export const JSONHeader = { 'Content-Type': 'application/json' };
export const oauth = {
  access: 'access_token',
  scope: 'scope',
  response: 'response_type',
  id: 'client_id',
  secret: 'client_secret',
  prompt: 'prompt',
  auth: 'authorization_code',
  redirect: 'redirect_uri',
}
export const code = 'code';