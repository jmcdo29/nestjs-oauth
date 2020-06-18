# Nestjs-Oauth

The NestJS Oauth module is a bit of an interesting case. Currently, only Google and GitHub are available OAuth providers, but others may come in the future.

## Installation

To install the package, use either

```sh
npm i nestjs-oauth
```

or

```sh
yarn nestjs-oauth
```

## Usage

The `OauthModule` does a lot of magic under the hood when it comes to binding the routes to the server, all according to `controllerRoot` and each `authorities.controller.root` and `authorities.controller.callback` value. The module will also take into account the global prefix if one is set.

### OauthModuleOptions

- controllerRoot: string - Sets the `@Controller()` string for the root of the controller
- authorities: [`OauthModuleProviderOptions`](#oauthmoduleprovideroptions)[] - the array of options for the OAuth module to make use of

### OauthModuleProviderOptions

This object dictates much of how the `OauthModule` operates under the hood. The object has the following shape

- name: `'google' | 'github'` - the name of the OAuth Provider. Currently only GitHub and Google are supported.
- controller: [`ControllerOptions`](#controlleroptions) - options specific to the controller class
- service: [`ServiceOptions`](#serviceoptions) - options specific to the service class
- provide: `(resp: {user: Record<any, any>, req: any }) => any` - a function to determine how to handle the returned user from the OAuth callout. This function can come from a class or can be a direct function. Part of the `user` parameter is the token information retrieved from the token call (the OAuth callback) and the other part is the user information retrieved from the identity endpoint provided by the OAuth authority. The Request object is also accessible for the case of wanting to set headers or cookies through packages similar to [`@nestjsplus/cookies`](https://github.com/nestjsplus/cookies).

### ControllerOptions

The object that dictates how the Controller class for the `OauthModule`. Both `root` and `callback` have the same interface, and require the same values as shown below:

- path: string - the location for the route to be bound
- guards: Array<CanActivate> - guards to run on the route
- pipes: Array<PipeTransform> - pipes to run on the route
- interceptors: Array<NestInterceptor> - interceptors to run on the route
- filters: Array<ExceptionFilter> - filters to run on the route
- decorators: Array<MethodDecorators> - decorators to apply to the route. This is specifically added for things like `@OgmaSkip()` or `@Throttle()` though can be used with `@UsePipes()` and the rest of the Nest enhancer decorators if preferred.

### ServiceOptions

- scope: string[] - an array of scopes to request from the authority provider. This **must** be passed as an array
- clientId: string - the client id for the authority you are using
- clientSecret: string - the client secret for the authority you are using
- callback: string - the callback url for the authority. This should match the `controller.callback` property, but should be a fully qualified URL instead of an endpoint path e.g. `http://localhost:3000/api/auth/google/callback`
- prompt: string - the kind of prompt to use with the oauth flow, is a prompt is supported.
- state: string - a state tracking token to know that the return of the OAuth call comes from the expected server.

> **NOTE**: if a state token is passed as a parameter, the `OauthService` method will check the returned state parameter against provided one, and will throw an `UnauthorizedException` if the values do not match.

#### Specific Providers

Each specific OAuth authority has their own provider values. These follow the values expected from the provider's OAuth documentation, usually changed from snake_case to camelCase. Intellisense should provide you with the options necessary. [Otherwise, you can look here](./lib/oauth.interface.ts)

## How it works

All right, so here's the fun part of the package: after you register the module, a `Controller` and `Service` class will be created to match the endpoints requested in the `authorities` array. When a `GET` call is made to `controllerRoot/controller.root`, a URL will be returned. This URL is the OAuth login URL, which the user should be redirected to. The reason this module does not automatically redirect is for logging purposes as a `res.redirect` will end up causing post-controller interceptors to not fire. **This is different from how Passport operates and should be noted**. After the user follows the OAuth flow, a callback is made from the OAuth server to your server, using the `controllerRoot/controller.callback` route and the `service.callback` value. This callback has the user access token and is then used to call to the providers identity endpoint (e.g. Google calls back to `https://www.googleapis.com/userinfo/v2/me`). Once the user is obtained from the identity provider, the `provider` method is called with the `user` object returned. From here, the developer can work with the user object as necessary, doing things like communicating with a database, or creating tokens for the user. Any value can be returned from this `provide` method, so it can be a JWT, or a simple message saying the user successfully logged in. This method can be async as well.

## TODO

- add more providers
- e2e testing
- maybe a better API

## Contributing

Feel free to help contribute to this project in any way possible. You can reach out to me on Discord (PerfectOrphan31#6003), [email me](mailto:me@jaymcdoniel.dev), or raise an issue here in the repository.

## License

This project is under an [MIT License](./LICENSE).
