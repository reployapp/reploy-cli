#!/usr/bin/env node --harmony
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _child_process = require('child_process');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _homeConfig = require('home-config');

var _homeConfig2 = _interopRequireDefault(_homeConfig);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _environment = require('./environment');

_commander2['default'].option('-s, --skip_bundle', 'Skip javascript bundle step').parse(process.argv);

if (_commander2['default'].skip_bundle) {
  console.log("Skipping javascript bundle step.");
} else {
  console.log("Starting bundle...");
  var bundle = (0, _child_process.spawnSync)('node', [_path2['default'].join(process.cwd(), 'node_modules/react-native/local-cli/cli.js'), 'bundle']);
  console.log(bundle.stdout.toString());
}

console.log("Uploading bundle...");
var url = 'http://reploy.io/api/v1/apps/' + _environment.appConf.app.id + '/' + _environment.appVersion + '/js_versions';

_superagent2['default'].post(url).set("X-ApiId", _environment.appConf.app.apiId).set("X-ApiSecret", _environment.appConf.app.apiSecret).attach('jsbundle', _path2['default'].join(process.cwd(), 'iOS/main.jsbundle')).end(function (err, res) {
  if (res.ok) {
    console.log('Done!');
    console.log(JSON.stringify(res.body));
  } else {
    console.log(res.body);
  }
});