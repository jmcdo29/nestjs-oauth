import {
  Controller,
  Get,
  HttpModule,
  HttpService,
  Module,
  Query,
  Req,
} from '@nestjs/common';
import { createConfigurableDynamicRootModule } from '@golevelup/nestjs-modules';
import {
  loginUrl,
  OAUTH_MODULE_OPTIONS,
  service,
  user,
} from './oauth.constants';
import { OauthController } from './oauth.controller';
import {
  OauthModuleOptions,
  OauthModuleProviderOptions,
  OauthCodeInterface,
} from './oauth.interface';
import { OauthService } from './oauth.service';
import {
  applyMethodDecorator,
  checkOptions,
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
            query: OauthCodeInterface,
            req: any,
          ) {
            return this[service][serviceCallbackFuncName](query, req);
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
          applyMethodDecorator(
            Get,
            option.controller.root.path,
            OauthController,
            controllerRootFunction,
          );
          checkOptions(
            option.controller.root,
            OauthController,
            controllerRootFunction,
          );
          applyMethodDecorator(
            Get,
            option.controller.callback.path,
            OauthController,
            controllerCallbackFunction,
          );
          checkOptions(
            option.controller.callback,
            OauthController,
            controllerCallbackFunction,
          );
          Query()(OauthController.prototype, controllerCallbackFunction, 0);
          Req()(OauthController.prototype, controllerCallbackFunction, 1);
        });
      },
      inject: [OAUTH_MODULE_OPTIONS, HttpService],
    },
  ],
}) {}
