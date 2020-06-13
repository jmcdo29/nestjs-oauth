import { HttpService } from '@nestjs/common';
import { of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { JSONHeader } from '../oauth.constants';
import { OauthProvider, ServiceOptions } from '../oauth.interface';
import { createGithubLoginUrl, createGithubUserFunction } from './github-url.factory';
import {
  createGoogleLoginUrl,
  createGoogleUserFunction,
} from './google-url.factory';
import { createLinkedinLoginUrl } from './linkedin-url.factory';

export const serviceLoginFunction = (
  provider: OauthProvider,
  options: ServiceOptions,
): string => {
  let url: string;
  switch (provider) {
    case 'google':
      url = createGoogleLoginUrl(options);
      break;
    case 'github':
      url = createGithubLoginUrl(options);
      break;
    case 'linkedin':
      url = createLinkedinLoginUrl(options);
      break;
  }
  return url;
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
        urlAndOptions = createGoogleUserFunction(options, code);
        break;
      case 'github':
        urlAndOptions = createGithubUserFunction(options, code);
        break;
    }
    return http
      .post(urlAndOptions.url, urlAndOptions.options, {
        headers: { ...JSONHeader },
      })
      .pipe(
        map(res => res.data),
        tap(console.log),
        switchMap(accessData =>
          http.get(urlAndOptions.userUrl, {
            headers: {
              Authorization: `Bearer ${accessData.access_token}`,
            },
          }),
        ),
        map(userData => userData.data),
        switchMap(user => of(service(user))),
      );
  };
  return func;
};
