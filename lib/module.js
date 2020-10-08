const { join, resolve } = require('path');

module.exports = async function (moduleOptions) {
  const filesDir = 'whppt/sitemaps';

  const options = { ...moduleOptions };

  this.addPlugin({
    src: resolve(__dirname, 'plugin.js'),
    fileName: join(filesDir, 'plugin.js'),
    options,
  });

  this.addTemplate({
    src: resolve(__dirname, 'components/Dashboard.vue'),
    fileName: join(filesDir, 'components/Dashboard.vue'),
    options,
  });
};

module.exports.serverModule = require('./serverModule.js');
module.exports.meta = require('../package.json');
