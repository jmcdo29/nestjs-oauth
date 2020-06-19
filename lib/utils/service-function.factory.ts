import { ForbiddenException, HttpService } from '@nestjs/common';
import { from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { JSONHeader } from '../oauth.constants';
import {
  CustomServiceOptions,
  GithubServiceOptions,
  GoogleServiceOptions,
  OauthCodeInterface,
  ServiceOptions,
} from '../oauth.interface';
import {
  createCustomLoginUrl,
  createCustomUserFunction,
} from './custom-url.factory';
import {
  createGithubLoginUrl,
  createGithubUserFunction,
} from './github-url.factory';
import {
  createGoogleLoginUrl,
  createGoogleUserFunction,
} from './google-url.factory';

export const serviceLoginFunction = (
  provider: string,
  options: ServiceOptions | CustomServiceOptions,
): { url: string; provider: string } => {
  let url: string;
  switch (provider) {
    case 'google':
      url = createGoogleLoginUrl(options as GoogleServiceOptions);
      break;
    case 'github':
      url = createGithubLoginUrl(options as GithubServiceOptions);
      break;
    default:
      url = createCustomLoginUrl(options as CustomServiceOptions);
      break;
  }
  return { url, provider };
};

export const serviceGetUserFunction = (
  provider: string,
  options: ServiceOptions | CustomServiceOptions,
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
      default:
        urlAndOptions = createCustomUserFunction(
          options as CustomServiceOptions,
          oauthResp.code,
        );
        break;
    }
    const state =
      (options as ServiceOptions).state ||
      (options as CustomServiceOptions)?.loginUrlParams.state ||
      undefined;
    if (state) {
      if (state !== oauthResp.state) {
        throw new ForbiddenException(
          `Expected a state value of ${state} but instead got ${oauthResp.state}`,
        );
      }
    }
    let tokenData: Record<string, any>;
    const axiosReq = {
      method:
        (options as CustomServiceOptions).tokenHttpMethod || ('post' as const),
      url: urlAndOptions.url,
      data: urlAndOptions.options,
      headers: JSONHeader,
    };
    return http.request(axiosReq).pipe(
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
