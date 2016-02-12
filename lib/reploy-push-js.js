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

_commander2.default.option('-p, --platform [platform]', 'Platform: "ios" or "android"').parse(process.argv);

function run() {
  var jsPath, user, platform, bundleArguments, bundleCommand, uploadcareId, bar;
  return regeneratorRuntime.async(function run$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          jsPath = '/tmp/' + _environment.appConf.app.id + '.jsbundle';
          _context.next = 3;
          return regeneratorRuntime.awrap((0, _api.currentUser)());

        case 3:
          user = _context.sent;
          platform = _commander2.default.platform || 'ios';


          console.log('Bundling javascript for ' + platform);
          bundleArguments = 'bundle --entry-file ./index.' + platform + '.js --dev false --platform ' + platform + ' --bundle-output ' + jsPath;

          console.log('react-native ' + bundleArguments);
          bundleCommand = (0, _child_process.spawnSync)('react-native', bundleArguments.split(" "));


          if (bundleCommand.stderr) {
            console.log(bundleCommand.stderr.toString());
          }

          uploadcareId = null;
          bar = new _progress2.default(':percent uploaded', { total: _fs2.default.statSync(jsPath).size });


          _superagent2.default.post('https://upload.uploadcare.com/base/').field('UPLOADCARE_PUB_KEY', '9e1ace5cb5be7f20d38a').field('UPLOADCARE_STORE', '1').attach('file', jsPath).on('progress', function (progress) {
            if (!bar.complete) {
              bar.tick(progress.loaded);
            }
          }).end(function (err, response) {
            if (err) {
              console.log(err);
            } else {
              uploadcareId = response.body.file;
              (0, _api.mutation)('createJSBundle', {
                uploadId: uploadcareId,
                application: _environment.appConf.app.id,
                createdAt: '@TIMESTAMP',
                platform: platform,
                user: user.id
              });
            }
          });

        case 13:
        case 'end':
          return _context.stop();
      }
    }
  }, null, this);
}

run();