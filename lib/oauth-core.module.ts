import {
  Controller,
  Get,
  HttpModule,
  HttpService,
  Module,
  Query,
  UseGuards,
  UseInterceptors,
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
  getLength,
  sanitizeFunctionName,
  serviceGetUserFunction,
  serviceLoginFunction,
} from './utils';

@Module({
  imports: [HttpModule],
  controllers: [OauthController],
})
export class OauthCoreModule extends createConfigurableDynamicRootModule<
  OauthCoreModule,
  OauthModuleOptions
>(OAUTH_MODULE_OPTIONS, {
  providers: [
    OauthService,
    {
      provide: 'REDEFINE_FUNCTIONS',
      useFactory: (options: OauthModuleOptions, http: HttpService) => {
        Controller(options.controllerRoot)(OauthController);
        options.authorities.forEach((option: OauthModuleProviderOptions) => {
          const controllerRootFunction = sanitizeFunctionName(
            option.controller.root.path + option.name,
          );
          const controllerCallbackFunction = sanitizeFunctionName(
            option.controller.callback.path + option.name,
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
          // Manually calling controller decorators.
          Get(option.controller.root.path)(
            OauthController,
            controllerRootFunction,
            Object.getOwnPropertyDescriptor(
              OauthController.prototype,
              controllerRootFunction,
            ),
          );
          // Add guards to controller login function.
          if (getLength(option.controller.root.guards)) {
            UseGuards(...option.controller.root.guards)(
              OauthController,
              controllerRootFunction,
              Object.getOwnPropertyDescriptor(
                OauthController.prototype,
                controllerRootFunction,
              ),
            );
          }
          Get(option.controller.callback.path)(
            OauthController,
            controllerCallbackFunction,
            Object.getOwnPropertyDescriptor(
              OauthController.prototype,
              controllerCallbackFunction,
            ),
          );
          Query(code)(OauthController.prototype, controllerCallbackFunction, 0);
          // Add interceptors to controller callback function.
          if (getLength(option.controller.callback.interceptors)) {
            UseInterceptors(...option.controller.callback.interceptors)(
              OauthController,
              controllerCallbackFunction,
              Object.getOwnPropertyDescriptor(
                OauthController.prototype,
                controllerCallbackFunction,
              ),
            );
          }
        });
      },
      inject: [OAUTH_MODULE_OPTIONS, HttpService],
    },
  ],
}) {}
