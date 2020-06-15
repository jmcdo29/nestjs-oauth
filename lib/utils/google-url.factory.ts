import { google, oauth } from '../oauth.constants';
import { GoogleServiceOptions } from '../oauth.interface';

export const createGoogleLoginUrl = (options: GoogleServiceOptions): string => {
  return `${google.loginUrl}?${oauth.scope}=${options.scope.join(' ')}&${
    oauth.access
  }=${options.accessType || 'online'}&${
    oauth.response
  }=${options.responseType || 'code'}&${oauth.redirect}=${
    options.callbackUrl
  }&${oauth.id}=${options.clientId}&${oauth.prompt}=${options.prompt ||
    'select_account'}`;
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
