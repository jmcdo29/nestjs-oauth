import { CustomServiceOptions } from '../oauth.interface';

export const createCustomLoginUrl = (options: CustomServiceOptions): string => {
  let queryString = '';
  const loginParams = options.loginUrlParams;
  Object.keys(loginParams).forEach((key) => {
    queryString += `${key}=${loginParams[key]}&`;
  });
  return `${options.loginUrl}?${queryString.substring(
    0,
    queryString.length - 1,
  )}`;
};

export const createCustomUserFunction = (
  options: CustomServiceOptions,
  code: string,
): {
  url: string;
  userUrl: string;
  options: {
    client_id: string;
    client_secret: string;
    code: string;
    redirect_uri: string;
    state: string;
  };
} => {
  const tokenOpts = {};
  const tokenParams = options.tokenUrlParams;
  Object.keys(tokenParams).forEach((key) => {
    tokenOpts[key] = tokenParams[key];
  });
  return {
    url: options.tokenUrl,
    userUrl: options.userUrl,
    options: {
      code,
      ...tokenOpts,
    },
  } as any;
};
