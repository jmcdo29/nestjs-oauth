import { github, oauth } from '../oauth.constants';
import { GithubServiceOptions } from '../oauth.interface';

export const createGithubLoginUrl = (options: GithubServiceOptions): string => {
  let queryString = `${oauth.id}=${options.clientId}`;
  if (options?.scope.length) {
    queryString += `&${oauth.scope}=${options.scope.join(' ')}`;
  }
  if (options.login) {
    queryString += `&login=${options.login}`;
  }
  if (options.callbackUrl) {
    queryString += `&${oauth.redirect}=${options.callbackUrl}`;
  }
  if (options.state) {
    queryString += `&${oauth.state}=${options.state}`;
  }
  if (options.allowSignup !== null && options.allowSignup !== undefined) {
    queryString += `&allow_signup=${options.allowSignup}`;
  }
  return `${github.loginUrl}?${queryString}`;
};

export const createGithubUserFunction = (
  options: GithubServiceOptions,
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
  return {
    url: github.tokenUrl,
    options: {
      client_id: options.clientId,
      client_secret: options.clientSecret,
      code,
      redirect_uri: options.callbackUrl,
      state: options.state,
    },
    userUrl: github.userUrl,
  };
};
