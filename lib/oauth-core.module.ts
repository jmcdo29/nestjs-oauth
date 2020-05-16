import {
  Controller,
  Get,
  HttpModule,
  HttpService,
  Module,
  Query,
} from '@nestjs/common';
import { createConfigurableDynamicRootModule } from '@golevelup/nestjs-modules';
import {
  code,
  loginUrl,
  OAUTH_MODULE_OPTIONS,
  service,
  user,
} from './oauth.constants';
import { OauthController } from './oauth.controller';
import {
  OauthModuleOptions,
  OauthModuleProviderOptions,
} from './oauth.interface';
import { OauthService } from './oauth.service';
import {
  serviceGetUserFunction,
  serviceLoginFunction,
} from './utils/service-function.factory';
import { sanitizeFunctionName } from './utils/sanitize';

@Module({})
export class OauthCoreModule extends createConfigurableDynamicRootModule<
  OauthCoreModule,
  OauthModuleOptions
>(OAUTH_MODULE_OPTIONS, {
  imports: [HttpModule],
  controllers: [OauthController],
  providers: [
    OauthService,
    {
      provide: 'REDEFINE_FUNCTIONS',
      useFactory: (options: OauthModuleOptions, http: HttpService) => {
        Controller(options.controllerRoot)(OauthController);
        options.authorities.forEach((option: OauthModuleProviderOptions) => {
          const controllerRootFunction = sanitizeFunctionName(
            option.controller.root + option.name,
          );
          const controllerCallbackFunction = sanitizeFunctionName(
            option.controller.callback + option.name,
          );
          const serviceLoginFuncName = sanitizeFunctionName(
            loginUrl + option.name,
          );
          const serviceCallbackFuncName = sanitizeFunctionName(
            user + option.name,
          );
          // CONTROLLER OVERRIDING
          OauthController.prototype[controllerRootFunction] = function() {
            return this[service][serviceLoginFuncName]();
          };
          OauthController.prototype[controllerCallbackFunction] = function(
            code: string,
          ) {
            return this[service][serviceCallbackFuncName](code);
          };
          // SERVICE OVERRIDING
          OauthService.prototype[serviceLoginFuncName] = function() {
            return serviceLoginFunction(option.name, option.service);
          };
          OauthService.prototype[
            serviceCallbackFuncName
          ] = serviceGetUserFunction(
            option.name,
            option.service,
            option.provide,
            http,
          );
          // manually calling controller decorators
          Get(option.controller.root)(
            OauthController,
            option.controller.root + option.name,
            Object.getOwnPropertyDescriptor(
              OauthController.prototype,
              controllerRootFunction,
            ),
          );
          Get(option.controller.callback)(
            OauthController,
            option.controller.callback + option.name,
            Object.getOwnPropertyDescriptor(
              OauthController.prototype,
              controllerCallbackFunction,
            ),
          );
          Query(code)(OauthController.prototype, controllerCallbackFunction, 0);
        });
      },
      inject: [OAUTH_MODULE_OPTIONS, HttpService],
    },
  ],
}) {}
