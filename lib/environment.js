'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _plist = require('plist');

var _plist2 = _interopRequireDefault(_plist);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _homeConfig = require('home-config');

var _homeConfig2 = _interopRequireDefault(_homeConfig);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

module.exports = {
  appConf: _homeConfig2['default'].load(_path2['default'].join(process.cwd(), ".reploy")),
  appVersion: _plist2['default'].parse(_fs2['default'].readFileSync(_path2['default'].join(process.cwd(), 'iOS/Info.plist'), 'utf8')).CFBundleShortVersionString,
  appName: _path2['default'].basename(process.cwd())
};