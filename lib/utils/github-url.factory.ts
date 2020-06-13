import { ServiceOptions } from '../oauth.interface';
import { github, oauth } from 'lib/oauth.constants';

export const createGithubLoginUrl = (options: ServiceOptions): string => {
  console.log(options);
  return `${github.loginUrl}?${oauth.scope}=${options.scope.join(' ')}&${oauth.id}=${options.clientId}&${oauth.redirect}=${options.callback}`;
};

export const createGithubUserFunction = (options: ServiceOptions, code: string): any => {
  return {
    url: github.tokenUrl,
    options: {
      client_id: options.clientId,
      client_secret: options.clientSecret,
      code,
      redirect_uri: options.callback,
    },
    userUrl: github.userUrl,
  }
}