# [0.3.0](https://github.com/jmcdo29/nestjs-oauth/compare/0.2.1...0.3.0) (2020-06-24)

### Features

- **custom:** adds ability for integration with GET token urls ([1d7294c](https://github.com/jmcdo29/nestjs-oauth/commit/1d7294c63cfcd91bc85997767b6ca1db4c22589b))
- **custom:** allows for basic custom oauth authority addition ([1a71219](https://github.com/jmcdo29/nestjs-oauth/commit/1a71219ed35f4f537930551fffc8aa13c3d4d9ee))
- allows for decorator usage and access to req in `provide` ([797c320](https://github.com/jmcdo29/nestjs-oauth/commit/797c320a7ec360c053c29c3ac667551cf8659d9b))
- allows for the use of all nest decorators ([304f047](https://github.com/jmcdo29/nestjs-oauth/commit/304f047eea42074b6dd4af1b9fbd820a9a5867ac))

### BREAKING CHANGES

- the `provide` method now has a different parameter type, from a simple object to a complex one.

## [0.2.1](https://github.com/jmcdo29/nestjs-oauth/compare/0.2.0...0.2.1) (2020-06-17)

### Bug Fixes

- allows for the use of a function that returns an observable ([93d1418](https://github.com/jmcdo29/nestjs-oauth/commit/93d1418b84e8c68e8f4f625fe71c92cab313e939))

# [0.2.0](https://github.com/jmcdo29/nestjs-oauth/compare/0.1.0...0.2.0) (2020-06-16)

### Features

- **github:** updates the github oauth login url flow ([aaa105b](https://github.com/jmcdo29/nestjs-oauth/commit/aaa105be2ac7544fcaf7925ef062584155dd7365))
- adds ability to use guards on login route and interceptors on cb ([175501c](https://github.com/jmcdo29/nestjs-oauth/commit/175501cabc14a43e6770a27d1a027eebd3c2d170))
- updates types to allow for better dev experience ([fa50bf7](https://github.com/jmcdo29/nestjs-oauth/commit/fa50bf7140bb5f326ae393121322f317ecc094af))

### BREAKING CHANGES

- The `OauthModuleOptions` have been updated in the `controller` and `service` objects. In the `controller` object, each route is now a `path` and `guards` or `interceptors` property, and the `service` now is specific to each provider.

# 0.1.0 (2020-06-14)

### Bug Fixes

- **google:** fixes access_type string ([cb64922](https://github.com/jmcdo29/nestjs-oauth/commit/cb64922d32ce84c5c9b26a7eff5a5b02abf3fc80))
- **module:** fix module options to only allow one controller root ([41b5d30](https://github.com/jmcdo29/nestjs-oauth/commit/41b5d30e542b6ab1e623cbef91aa5e40bebeda9f))

### Features

- **facebook:** removes facebook as a provider ([6651036](https://github.com/jmcdo29/nestjs-oauth/commit/6651036668d41d0678a29f5216ad6a1faba8cfb2))
- **github:** adds github oauth flow ([68fdc2f](https://github.com/jmcdo29/nestjs-oauth/commit/68fdc2f016d0dce02f96c9f0df4b0589934534fa))
- **google:** implements google oauth options ([e71a744](https://github.com/jmcdo29/nestjs-oauth/commit/e71a744d41a1f86894958500b7193112a7a8e4d2))
- **module:** implements initial draft of OauthModule ([2958f0a](https://github.com/jmcdo29/nestjs-oauth/commit/2958f0ae23e96a88528ea861b72daa7503e5b728))
