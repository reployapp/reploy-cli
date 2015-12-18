#!/usr/bin/env node --harmony
'use strict';

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

var _lodash = require('lodash');

var _osHomedir = require('os-homedir');

var _osHomedir2 = _interopRequireDefault(_osHomedir);

var _formData = require('form-data');

var _formData2 = _interopRequireDefault(_formData);

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _progress = require('progress');

var _progress2 = _interopRequireDefault(_progress);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var jsPath = '/tmp/' + _environment.appConf.app.id + '.jsbundle';

console.log("Bundling javascript...");
(0, _child_process.spawnSync)("react-native", ["bundle", "--entry-file", "./index.ios.js", "--platform", "ios", "--bundle-output", jsPath]);
console.log("Done!");

var uploadcareId = null;

var bar = new _progress2.default(':percent uploaded', { total: _fs2.default.statSync(jsPath).size });

_superagent2.default.post('https://upload.uploadcare.com/base/').field("UPLOADCARE_PUB_KEY", '9e1ace5cb5be7f20d38a').field("UPLOADCARE_STORE", '1').attach('file', jsPath).on('progress', function (progress) {
  if (!bar.complete) {
    bar.tick(progress.loaded);
  }
}).end(function (err, response) {
  if (err) {
    console.log(err);
  } else {
    uploadcareId = response.body.file;
    _api2.default.query('\n        mutation createJSBundle($input: _CreateJSBundleInput!) {\n          createJSBundle(input: $input) {\n            id,\n            application {\n              name\n            }\n          }\n        }\n      ', { input: { uploadId: uploadcareId, application: _environment.appConf.app.id, createdAt: "@TIMESTAMP" } }).then(function (response) {
      console.log("Done!");
    }).catch(function (error) {
      console.log(error);
    });
  }
});