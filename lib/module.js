const { join, resolve } = require('path');

module.exports = async function (moduleOptions) {
  const filesDir = 'whppt/sitemaps';

  const options = { ...moduleOptions };

  this.addPlugin({
    src: resolve(__dirname, 'plugin.js'),
    fileName: join(filesDir, 'plugin.js'),
    options,
  });

  const components = [
    { src: 'components/Dashboard.vue', fileName: 'components/Dashboard.vue' },
    { src: 'components/Icons/Check.vue', fileName: 'components/Icons/Check.vue' },
    { src: 'components/Icons/Close.vue', fileName: 'components/Icons/Close.vue' },
  ];

  for (const component of components) {
    this.addTemplate({
      src: resolve(__dirname, component.src),
      fileName: join(filesDir, component.fileName),
      options,
    });
  }
};

module.exports.serverModule = require('./serverModule.js');
module.exports.meta = require('../package.json');
