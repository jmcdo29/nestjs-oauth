export interface ControllerOptions {
  root: string;
  callback: string;
}

export interface ServiceOptions {
  scope: string[];
  clientId: string;
  prompt?: string;
  clientSecret: string;
  callback: string;
  accessType?: string;
  responseType?: string;
}

export interface OauthModuleProviderOptions {
  name: OauthProvider;
  controller: ControllerOptions;
  service: ServiceOptions;
  provide: (user: any) => any;
}

export interface OauthModuleOptions {
  authorities: OauthModuleProviderOptions[];
  controllerRoot: string;
}

export type OauthProvider = 'google' | 'facebook' | 'github' | 'linkedin';
