import { Module, HttpModule } from '@nestjs/common';
import { PATH_METADATA } from '@nestjs/common/constants';
import { createConfigurableDynamicRootModule } from '@golevelup/nestjs-modules';
import { OauthController } from './oauth.controller';
import { OauthService } from './oauth.service';

@Module({})
export class OauthCoreModule extends createConfigurableDynamicRootModule<
  OauthCoreModule,
  {
    controller: {
      root: string;
      callback: string;
      name?: string;
    };
    service: {
      scope: string[];
      clientId: string;
      prompt?: string;
      clientSecret: string;
      callback: string;
    };
    provide: { saveUser: (data: any) => any };
    name: string;
  }
>('OAUTH_MODULE_OPTION', {
  imports: [HttpModule],
  controllers: [OauthController],
  providers: [
    OauthService,
    {
      provide: 'OAUTH_CONTROLLER_HACK',
      useFactory: (option: {
        root: string;
        callback: string;
        name?: string;
        controllerName: string;
      }) => {
        OauthController.prototype[option.root] = function() {
          return this['oauthService']['getLoginUrl']();
        }
        OauthController.prototype[option.controllerName+'CallBack'] = OauthController.prototype.getUser;
        Reflect.defineMetadata(
          PATH_METADATA,
          option.name || '',
          OauthController,
        );
        Reflect.defineMetadata(
          PATH_METADATA,
          option.root,
          OauthController.prototype[option.root],
        );
        Reflect.defineMetadata(
          PATH_METADATA,
          option.callback,
          OauthController.prototype[option.controllerName+'CallBack'],
        );
      },
      inject: ['OAUTH_CONTROLLER_OPTIONS'],
    },
    {
      provide: 'OAUTH_CONTROLLER_OPTIONS',
      inject: ['OAUTH_MODULE_OPTION'],
      useFactory: options => {
        return {
          ...options.controller,
          controllerName: options.name
        }
      },
    },
    {
      provide: 'OAUTH_SERVICE_OPTIONS',
      inject: ['OAUTH_MODULE_OPTION'],
      useFactory: options => {
        return {
          ...options.service,
        };
      },
    },
    {
      provide: 'PROVIDED_SERVICE',
      inject: ['OAUTH_MODULE_OPTION'],
      useFactory: option => option.provide,
    },
  ],
}) {}
