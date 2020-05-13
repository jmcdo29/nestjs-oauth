import { google, oauth } from '../oauth.constants';
import { ServiceOptions } from '../oauth.interface';

export const createGoogleLoginUrl = (options: ServiceOptions): string => {
  return `${google.loginUrl}?${oauth.scope}=${options.scope.join(' ')}&${
    oauth.access
  }=${options.accessType || 'online'}&${
    oauth.response
  }=${options.responseType || 'code'}&${oauth.redirect}=${options.callback}&${
    oauth.id
  }=${options.clientId}&${oauth.prompt}=${options.prompt || 'select_account'}`;
};

export const createGoogleUserFunction = (
  options: ServiceOptions,
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
      redirect_uri: options.callback,
    },
    userUrl: google.userUrl,
  };
};
