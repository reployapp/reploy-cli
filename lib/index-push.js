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

var _plist = require('plist');

var _plist2 = _interopRequireDefault(_plist);

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var appConf = _homeConfig2['default'].load(_path2['default'].join(process.cwd(), ".reploy"));

// console.log("Starting bundle")
// var bundle = spawnSync('node', [path.join(process.cwd(), 'node_modules/react-native/local-cli/cli.js'), 'bundle']);
// console.log(bundle.stdout.toString());

var appPlist = _plist2['default'].parse(_fs2['default'].readFileSync(_path2['default'].join(process.cwd(), 'iOS/Info.plist'), 'utf8'));

_superagent2['default'].post('http://reploy.io/apps/' + appConf.app.id + '/' + appPlist.CFBundleShortVersionString + '/js_versions').attach('jsbundle', _path2['default'].join(process.cwd(), 'iOS/main.jsbundle')).end(function (err, res) {
  if (res.ok) {
    console.log('yay got ' + JSON.stringify(res.body));
  } else {
    console.log('Oh no! error ' + res.text);
  }
});