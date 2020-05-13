import { Module, HttpModule, Get, Query, Controller, HttpService } from '@nestjs/common';
import { createConfigurableDynamicRootModule } from '@golevelup/nestjs-modules';
import { OauthController } from './oauth.controller';
import { OauthModuleOptions } from './oauth.interface';
import { OauthService } from './oauth.service';
import {
  serviceLoginFunction,
  serviceGetUserFunction,
} from './utils/service-function.factory';

@Module({})
export class OauthCoreModule extends createConfigurableDynamicRootModule<
  OauthCoreModule,
  OauthModuleOptions[]
>('OAUTH_MODULE_OPTIONS', {
  imports: [HttpModule],
  controllers: [OauthController],
  providers: [
    OauthService,
    {
      provide: 'REDEFINE_FUNCTIONS',
      useFactory: (options: OauthModuleOptions[], http: HttpService) => {
        options.forEach((option: OauthModuleOptions) => {
          // CONTROLLER OVERRIDING
          OauthController.prototype[
            option.controller.root + option.name
          ] = function() {
            return this['oauthService'][`getLoginUrl${option.name}`]();
          };
          OauthController.prototype[option.controller.callback + option.name] =
            function(code: string) {
              return this['oauthService'][`getUser${option.name}`](code);
            }
          // SERVICE OVERRIDING
          OauthService.prototype[`getLoginUrl${option.name}`] = function() {
            return serviceLoginFunction(option.name, option.service);
          };
          OauthService.prototype[
            `getUser${option.name}`
          ] = serviceGetUserFunction(option.name, option.service, option.provide, http);
          // manually calling controller decorators
          Controller(option.controllerRoot)(OauthController);
          Get(option.controller.root)(OauthController, option.controller.root
             + option.name, Object.getOwnPropertyDescriptor(OauthController.prototype, `${option.controller.root}${option.name}`));
          Get(option.controller.callback)(OauthController, option.controller.callback + option.name, Object.getOwnPropertyDescriptor(OauthController.prototype, `${option.controller.callback}${option.name}`));
          Query('code')(OauthController.prototype, `${option.controller.callback}${option.name}`, 0);
        });
      },
      inject: ['OAUTH_MODULE_OPTIONS', HttpService],
    },
  ],
}) {}
