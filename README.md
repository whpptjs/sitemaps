# @whppt/sitemaps

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]

[📖 **Release Notes**](./CHANGELOG.md)

## Table of Contents

- [Features](#features)
- [Usage](#usage)
- [Options](#options)
- [License](#license)

## Features

- Sitemaps API queries.
- Sitemaps viewing tool, available in the dashboard.

## Usage

1. Add `@whppt/sitemaps` dependency to your project

```bash
yarn add @whppt/sitemaps # or npm install @whppt/sitemaps
```

2. Add `@whppt/sitemaps` to the `modules` section of `nuxt.config.js`

```js
{
  modules: [
    // Simple usage
    '@whppt/sitemaps',

    // With options
    [
      '@whppt/sitemaps',
      {
        /* module options */
      },
    ],
  ];
}
```

_note: nuxt modules loads modules in a reverse order, make sure to play any whppt modules before the @whppt/nuxt module_

3. Register the serverModule with `@whppt/api-express`, update your `~/server/index.js` file to include.

```js
const { serverModule } = require('@whppt/sitemaps');
// require any plugins that contain their own pageTypes like so
const myPlugin = require('./path/to/my/plugin.js').default;

const options = {
  modules: {
    // any other custom modules go here..
    sitemap: { filter: serverModule },
  },
  // pageTypes is required to tell the sitemaps query about all
  // of your custom pageTypes.
  pageTypes: [myPlugin.pageType /* Any other pageTypes you want the sitemaps module to be aware of */],
};
```

## Options

coming soon...

## License

[MIT License](./LICENSE)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/@whppt/sitemaps/latest.svg
[npm-version-href]: https://npmjs.com/package/@whppt/sitemaps
[npm-downloads-src]: https://img.shields.io/npm/dt/@whppt/sitemaps.svg
[npm-downloads-href]: https://npmjs.com/package/@whppt/sitemaps
[github-actions-ci-src]: https://github.com/whpptjs/sitemaps/workflows/ci/badge.svg
[github-actions-ci-href]: https://github.com/whpptjs/sitemaps/actions?query=workflow%3Aci
[codecov-src]: https://img.shields.io/codecov/c/github/whpptjs/sitemaps.svg
[codecov-href]: https://codecov.io/gh/whpptjs/sitemaps
[license-src]: https://img.shields.io/npm/l/@whppt/sitemaps.svg
[license-href]: https://npmjs.com/package/@whppt/sitemaps
