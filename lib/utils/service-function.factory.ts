import { ForbiddenException, HttpService } from '@nestjs/common';
import { from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { JSONHeader } from '../oauth.constants';
import {
  GithubServiceOptions,
  GoogleServiceOptions,
  OauthCodeInterface,
  OauthProvider,
  ServiceOptions,
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
  service: (resp: { user: Record<any, any>; req: any }) => any,
  http: HttpService,
): any => {
  let urlAndOptions: {
    url: string;
    options: Record<string, any>;
    userUrl: string;
  };
  const func = (oauthResp: OauthCodeInterface, req: any) => {
    switch (provider) {
      case 'google':
        urlAndOptions = createGoogleUserFunction(
          options as GoogleServiceOptions,
          oauthResp.code,
        );
        break;
      case 'github':
        urlAndOptions = createGithubUserFunction(
          options as GithubServiceOptions,
          oauthResp.code,
        );
        break;
    }
    if (options.state) {
      if (options.state !== oauthResp.state) {
        throw new ForbiddenException(
          `Expected a state value of ${options.state} but instead got ${oauthResp.state}`,
        );
      }
    }
    let tokenData: Record<string, any>;
    return http
      .post(urlAndOptions.url, urlAndOptions.options, {
        headers: { ...JSONHeader },
      })
      .pipe(
        map((res) => {
          tokenData = res.data;
          return tokenData;
        }),
        switchMap((accessData) =>
          http.get(urlAndOptions.userUrl, {
            headers: {
              Authorization: `Bearer ${accessData.access_token}`,
            },
          }),
        ),
        map((userData) => userData.data),
        switchMap((user) => {
          const retVal = service({ user: { ...tokenData, ...user }, req });
          if (retVal.pipe) {
            return retVal;
          }
          return from(retVal);
        }),
      );
  };
  return func;
};
