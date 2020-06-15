import { HttpService } from '@nestjs/common';
import { of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { JSONHeader } from '../oauth.constants';
import {
  OauthProvider,
  ServiceOptions,
  GoogleServiceOptions,
  GithubServiceOptions,
} from '../oauth.interface';
import {
  createGithubLoginUrl,
  createGithubUserFunction,
} from './github-url.factory';
import {
  createGoogleLoginUrl,
  createGoogleUserFunction,
} from './google-url.factory';

export const serviceLoginFunction = (
  provider: OauthProvider,
  options: ServiceOptions,
): { url: string; provider: string } => {
  let url: string;
  switch (provider) {
    case 'google':
      url = createGoogleLoginUrl(options as GoogleServiceOptions);
      break;
    case 'github':
      url = createGithubLoginUrl(options as GithubServiceOptions);
      break;
  }
  return { url, provider };
};

export const serviceGetUserFunction = (
  provider: OauthProvider,
  options: ServiceOptions,
  service: (user: any) => any,
  http: HttpService,
): any => {
  let urlAndOptions: {
    url: string;
    options: Record<string, any>;
    userUrl: string;
  };
  const func = (code: string) => {
    switch (provider) {
      case 'google':
        urlAndOptions = createGoogleUserFunction(
          options as GoogleServiceOptions,
          code,
        );
        break;
      case 'github':
        urlAndOptions = createGithubUserFunction(
          options as GithubServiceOptions,
          code,
        );
        break;
    }
    return http
      .post(urlAndOptions.url, urlAndOptions.options, {
        headers: { ...JSONHeader },
      })
      .pipe(
        map((res) => res.data),
        switchMap((accessData) =>
          http.get(urlAndOptions.userUrl, {
            headers: {
              Authorization: `Bearer ${accessData.access_token}`,
            },
          }),
        ),
        map((userData) => userData.data),
        switchMap((user) => of(service(user))),
      );
  };
  return func;
};
