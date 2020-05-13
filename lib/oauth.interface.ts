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

export interface OauthModuleOptions {
  name: OauthProvider;
  controller: ControllerOptions;
  service: ServiceOptions;
  controllerRoot: string;
  provide: (user: any) => any;
}

export type OauthProvider = 'google' | 'facebook' | 'github' | 'linkedin';
