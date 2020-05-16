import { AsyncModuleConfig } from '@golevelup/nestjs-modules';
import { Module, DynamicModule } from '@nestjs/common';
import { OauthCoreModule } from './oauth-core.module';
import { OauthModuleOptions } from './oauth.interface';

@Module({})
export class OauthModule {
  static forRoot(oauthOptions: OauthModuleOptions): DynamicModule {
    return OauthCoreModule.forRoot(OauthCoreModule, oauthOptions);
  }

  static forRootAsync(oauthAsyncOptions: AsyncModuleConfig<OauthModuleOptions>): DynamicModule {
    return OauthCoreModule.forRootAsync(OauthCoreModule, oauthAsyncOptions);
  }
}
