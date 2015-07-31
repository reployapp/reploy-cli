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

// console.log("Starting bundle")
// var bundle = spawnSync('node', [path.join(process.cwd(), 'node_modules/react-native/local-cli/cli.js'), 'bundle']);
// console.log(bundle.stdout.toString());

var url = 'http://reploy.io/apps/' + _environment.appConf.app.id + '/' + _environment.appVersion + '/js_versions';
console.log(url);
_superagent2['default'].post(url).attach('jsbundle', _path2['default'].join(process.cwd(), 'iOS/main.jsbundle')).end(function (err, res) {
  if (res.ok) {
    console.log('yay got ' + JSON.stringify(res.body));
  } else {
    console.log('Oh no! error ' + res.text);
  }
});