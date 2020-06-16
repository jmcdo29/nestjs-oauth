import { google, oauth } from '../oauth.constants';
import { GoogleServiceOptions } from '../oauth.interface';

export const createGoogleLoginUrl = (options: GoogleServiceOptions): string => {
  let queryString = `${oauth.scope}=${options.scope.join(' ')}`;
  queryString += `&${oauth.id}=${options.clientId}`;
  queryString += `&${oauth.redirect}=${options.callbackUrl}`;
  if (options.accessType) {
    queryString += `&${oauth.access}=${options.accessType}`;
  }
  if (options.prompt) {
    queryString += `&${oauth.prompt}=${options.prompt}`;
  }
  if (options.responseType) {
    queryString += `&${oauth.response}=${options.responseType}`;
  }
  if (
    options.includeGrantedScopes !== null &&
    options.includeGrantedScopes !== undefined
  ) {
    queryString += `&${oauth.includeScopes}=${options.includeGrantedScopes}`;
  }
  if (options.loginHint) {
    queryString += `&${oauth.loginHint}=${options.loginHint}`;
  }
  if (options.state) {
    queryString += `&${oauth.state}=${options.state}`;
  }
  return `${google.loginUrl}?${queryString}`;
};

export const createGoogleUserFunction = (
  options: GoogleServiceOptions,
  code: string,
): {
  url: string;
  options: Record<string, any>;
  userUrl: string;
} => {
  return {
    url: google.tokenUrl,
    options: {
      client_id: options.clientId,
      client_secret: options.clientSecret,
      code,
      grant_type: oauth.auth,
      redirect_uri: options.callbackUrl,
    },
    userUrl: google.userUrl,
  };
};
