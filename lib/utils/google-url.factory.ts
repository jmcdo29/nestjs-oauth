import { ServiceOptions } from '../oauth.interface';

export const createGoogleLoginUrl = (options: ServiceOptions): string => {
  return `https://accounts.google.com/o/oauth2/v2/auth?scope=${
    Array.isArray(options.scope) ? options.scope.join(' ') : options.scope
  }&access_type=online&response_type=code&redirect_uri=${
    options.callback
  }&client_id=${options.clientId}&prompt=${options.prompt || 'select_account'}`;
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
    url: 'https://oauth2.googleapis.com/token',
    options: {
      client_id: options.clientId,
      client_secret: options.clientSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: options.callback,
    },
    userUrl: 'https://www.googleapis.com/userinfo/v2/me'
  }
};
