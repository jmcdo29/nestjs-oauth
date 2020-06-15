import { github, oauth } from '../oauth.constants';
import { GithubServiceOptions } from '../oauth.interface';

export const createGithubLoginUrl = (options: GithubServiceOptions): string => {
  return `${github.loginUrl}?${oauth.scope}=${options.scope.join(' ')}&${
    oauth.id
  }=${options.clientId}&${oauth.redirect}=${options.callbackUrl}`;
};

export const createGithubUserFunction = (
  options: GithubServiceOptions,
  code: string,
): any => {
  return {
    url: github.tokenUrl,
    options: {
      client_id: options.clientId,
      client_secret: options.clientSecret,
      code,
      redirect_uri: options.callbackUrl,
    },
    userUrl: github.userUrl,
  };
};
