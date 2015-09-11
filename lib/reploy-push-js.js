#!/usr/bin/env node --harmony
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _child_process = require('child_process');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _api = require('./api');

var _api2 = _interopRequireDefault(_api);

var _environment = require('./environment');

_commander2['default'].option('-r, --release_notes [notes]', 'Release notes for this version', null).option('-s, --skip_bundle', 'Skip javascript bundle step').parse(process.argv);

if (_commander2['default'].skip_bundle) {
  console.log("Skipping javascript bundle step.");
} else {
  console.log("Starting bundle...");
  var bundle = (0, _child_process.spawnSync)('node', [_path2['default'].join(process.cwd(), 'node_modules/react-native/local-cli/cli.js'), 'bundle']);
  console.log(bundle.stdout.toString());
}
console.log(_commander2['default']);
console.log("Uploading bundle...");

_api2['default'].post('/apps/' + _environment.appConf.app.id + '/js_versions', {
  fields: [{ name: 'release_notes',
    value: _commander2['default'].release_notes }],
  attachments: [{ field: 'jsbundle', path: _path2['default'].join(process.cwd(), 'iOS/main.jsbundle') }, { field: 'package_json', path: _path2['default'].join(process.cwd(), 'package.json') }]
}).then(function (response) {
  console.log('Version number: ' + response.body.version_number);
  console.log('Bundle hash: ' + response.body.bundle_hash);
}, function (response) {
  if (response.body && response.body.errors) {
    console.log(response.body.errors);
  } else {
    console.log(response.res.error);
  }
});