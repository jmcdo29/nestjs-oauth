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
import { OauthModuleOptions } from './oauth.interface';
import { OauthService } from './oauth.service';
import {
  serviceGetUserFunction,
  serviceLoginFunction,
} from './utils/service-function.factory';

@Module({})
export class OauthCoreModule extends createConfigurableDynamicRootModule<
  OauthCoreModule,
  OauthModuleOptions[]
>(OAUTH_MODULE_OPTIONS, {
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
            return this[service][`${loginUrl}${option.name}`]();
          };
          OauthController.prototype[
            option.controller.callback + option.name
          ] = function(code: string) {
            return this[service][`${user}${option.name}`](code);
          };
          // SERVICE OVERRIDING
          OauthService.prototype[`${loginUrl}${option.name}`] = function() {
            return serviceLoginFunction(option.name, option.service);
          };
          OauthService.prototype[
            `${user}${option.name}`
          ] = serviceGetUserFunction(
            option.name,
            option.service,
            option.provide,
            http,
          );
          // manually calling controller decorators
          Controller(option.controllerRoot)(OauthController);
          Get(option.controller.root)(
            OauthController,
            option.controller.root + option.name,
            Object.getOwnPropertyDescriptor(
              OauthController.prototype,
              `${option.controller.root}${option.name}`,
            ),
          );
          Get(option.controller.callback)(
            OauthController,
            option.controller.callback + option.name,
            Object.getOwnPropertyDescriptor(
              OauthController.prototype,
              `${option.controller.callback}${option.name}`,
            ),
          );
          Query(code)(
            OauthController.prototype,
            `${option.controller.callback}${option.name}`,
            0,
          );
        });
      },
      inject: [OAUTH_MODULE_OPTIONS, HttpService],
    },
  ],
}) {}
