import { CustomServiceOptions } from '../oauth.interface';

export const createCustomLoginUrl = (options: CustomServiceOptions): string => {
  const loginParams = options.loginUrlParams;
  const queryString = Object.keys(loginParams).map(
    (key) => `${key}=${loginParams[key]}`,
  );
  return `${options.loginUrl}?${queryString.join('&')}`;
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
  const { redirect_uri, client_id } = options.loginUrlParams;
  const tokenOpts = { ...options.tokenUrlParams, redirect_uri, client_id };
  if (options.tokenHttpMethod === 'get') {
    const queryString =
      Object.keys(tokenOpts)
        .map((key) => `${key}=${tokenOpts[key]}`)
        .join('&') + `&code=${code}`;
    return {
      url: options.tokenUrl + `?${queryString}`,
      userUrl: options.userUrl,
    } as any;
  }
  return {
    url: options.tokenUrl,
    userUrl: options.userUrl,
    options: {
      code,
      ...tokenOpts,
    },
  } as any;
};
