import {
  CanActivate,
  ExceptionFilter,
  NestInterceptor,
  PipeTransform,
} from '@nestjs/common';

/**
 * G E N E R A L   I N T E R F A C E S
 */

export interface RouteOptions {
  path: string;
  pipes?: (PipeTransform | Function)[];
  guards?: (CanActivate | Function)[];
  interceptors?: (NestInterceptor | Function)[];
  filters?: (ExceptionFilter | Function)[];
  decorators?: MethodDecorator[];
}

export interface ControllerOptions {
  root: RouteOptions;
  callback: RouteOptions;
}

export interface ServiceOptions {
  scope?: string[];
  clientId: string;
  prompt?: string;
  clientSecret: string;
  callbackUrl?: string;
  state?: string;
}

interface OauthModuleOptionsBase {
  controller: ControllerOptions;
  provide: (resp: {
    user: Record<string, any>;
    req: Record<string, any>;
  }) => any;
}

/**
 * G O O G L E   I N T E R F A C E S
 */

export interface GoogleServiceOptions extends ServiceOptions {
  scope: string[];
  callbackUrl: string;
  accessType?: string;
  responseType?: string;
  includeGrantedScopes?: boolean;
  loginHint?: string;
}

export interface GoogleUser {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string[];
  token_type: string;
  [index: string]: any;
}

interface GoogleOauthModuleOptions extends OauthModuleOptionsBase {
  name: 'google';
  service: GoogleServiceOptions;
  provide: (resp: { user: GoogleUser; req: any }) => any;
}

/**
 * G I T H U B   I N T E R F A C E S
 */

export interface GithubServiceOptions extends ServiceOptions {
  login?: string;
  allowSignup?: boolean;
}

export interface GithubUser {
  access_token: string;
  scope: string;
  token_type: string;
  [index: string]: any;
}

interface GithubOauthModuleOptions extends OauthModuleOptionsBase {
  name: 'github';
  service: GithubServiceOptions;
  provide: (resp: { user: GithubUser; req: any }) => any;
}

/**
 * C U S T O M   I N T E R F A C E
 */

export interface CustomServiceOptions {
  loginUrl: string;
  tokenUrl: string;
  userUrl: string;
  loginUrlParams: {
    client_id: string;
    response_type: string;
    redirect_uri?: string;
    scope?: string;
    state?: string;
    [index: string]: any;
  };
  tokenUrlParams: {
    grant_type: string;
    client_secret: string;
    [index: string]: any;
  };
  tokenHttpMethod?: 'get' | 'post';
}

interface CustomOauthModuleOptions extends OauthModuleOptionsBase {
  name: string;
  service: CustomServiceOptions;
}

/**
 * M O D U L E   O P T I O N S
 */

export type OauthModuleProviderOptions =
  | GoogleOauthModuleOptions
  | GithubOauthModuleOptions
  | CustomOauthModuleOptions;

export interface OauthModuleOptions {
  authorities: OauthModuleProviderOptions[];
  controllerRoot: string;
}

export type OauthProvider = 'google' | 'github';

export interface OauthCodeInterface {
  code: string;
  state?: string;
}

export interface GoogleOauthCode extends OauthCodeInterface {
  scope: string;
  authUser: string;
  prompt: string;
}
