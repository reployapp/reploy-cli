'use strict';

var _plist = require('plist');

var _plist2 = _interopRequireDefault(_plist);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _homeConfig = require('home-config');

var _homeConfig2 = _interopRequireDefault(_homeConfig);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _rollbar = require('rollbar');

var _rollbar2 = _interopRequireDefault(_rollbar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_rollbar2.default.init("63d2c4302f7f4fc1a580d8de4f36f590");
_rollbar2.default.handleUncaughtExceptions("63d2c4302f7f4fc1a580d8de4f36f590", { exitOnUncaughtException: true });

var ENV = process.env.REPLOY_ENV || 'production';

var FILENAME = '.reploy' + (ENV == 'development' ? '.development' : '');
var ENDPOINT = ENV == 'development' ? 'molecular-ununpentium-702' : 'practical-improvement-29';

var appConfigPath = _path2.default.join(process.cwd(), FILENAME);

try {
  var file = _fs2.default.readFileSync(_path2.default.join(process.cwd(), 'iOS/Info.plist'), 'utf8');
  var appVersion = _plist2.default.parse(file).CFBundleShortVersionString;
} catch (e) {
  if (e.code != 'ENOENT') {
    throw e;
  }
}

var globalConf = _homeConfig2.default.load(FILENAME);

module.exports = {
  apiEndpoint: ENDPOINT + '.myreindex.com',
  globalConf: globalConf,
  appConf: _homeConfig2.default.load(appConfigPath),
  appVersion: appVersion || null,
  appName: _path2.default.basename(process.cwd()),
  configFilename: FILENAME
};