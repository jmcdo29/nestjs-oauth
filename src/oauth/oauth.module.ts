import { Module, DynamicModule } from '@nestjs/common';
import { OauthCoreModule } from './oauth-core.module';

export const OauthModule = (options: {
  name: string;
}): {
  forRoot: (oauthOptions: any) => DynamicModule;
  forRootAsync: (oauthAsyncOptions: any) => DynamicModule;
} => {
  class OauthModuleMixin {
    static forRoot(oauthOptions: any): DynamicModule {
      return OauthCoreModule.forRoot(OauthCoreModule, {...oauthOptions,  name: options.name});
    }

    static forRootAsync(oauthAsyncOptions: any): DynamicModule {
      return OauthCoreModule.forRootAsync(OauthCoreModule, {...oauthAsyncOptions, name: options.name});
    }
  }

  Object.defineProperty(OauthModuleMixin, 'name', {
    value: `${OauthModuleMixin.name}${options.name}`,
  });
  Module({})(OauthModuleMixin);
  console.log(OauthModuleMixin);
  return OauthModuleMixin;
};
