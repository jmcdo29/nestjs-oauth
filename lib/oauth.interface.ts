import { CanActivate, NestInterceptor } from '@nestjs/common';

export interface ControllerOptions {
  root: {
    path: string;
    guards?: (CanActivate | Function)[];
  };
  callback: {
    path: string;
    interceptors?: (NestInterceptor<any, any> | Function)[];
  };
}

export interface ServiceOptions {
  scope?: string[];
  clientId: string;
  prompt?: string;
  clientSecret: string;
  callbackUrl?: string;
  state?: string;
}

export interface GoogleServiceOptions extends ServiceOptions {
  scope: string[];
  callbackUrl: string;
  accessType?: string;
  responseType?: string;
  includeGrantedScopes?: boolean;
  loginHint?: string;
}

export interface GithubServiceOptions extends ServiceOptions {
  login?: string;
  allowSignup?: boolean;
}

interface OauthModuleOptionsBase {
  controller: ControllerOptions;
  provide: (user: any) => any;
}

interface GoogleOauthModuleOptions extends OauthModuleOptionsBase {
  name: 'google';
  service: GoogleServiceOptions;
}

interface GithubOauthModuleOptions extends OauthModuleOptionsBase {
  name: 'github';
  service: GithubServiceOptions;
}

export type OauthModuleProviderOptions =
  | GoogleOauthModuleOptions
  | GithubOauthModuleOptions;

export interface OauthModuleOptions {
  authorities: OauthModuleProviderOptions[];
  controllerRoot: string;
}

export type OauthProvider = 'google' | 'github';
