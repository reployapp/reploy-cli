#!/usr/bin/env node
'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var run = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
    var jsPath, user, platform, bundleArguments, bundleCommand, uploadcareId;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            jsPath = '/tmp/' + _environment.appConf.app.id + '.jsbundle';
            _context.next = 3;
            return (0, _api.currentUser)();

          case 3:
            user = _context.sent;
            platform = _commander2.default.platform || 'ios';


            if (!_commander2.default.skip) {
              console.log('Bundling javascript for ' + platform);
              bundleArguments = 'bundle --entry-file ./index.' + platform + '.js --dev false --platform ' + platform + ' --bundle-output ' + jsPath;

              console.log('react-native ' + bundleArguments);
              bundleCommand = (0, _child_process.spawnSync)('react-native', bundleArguments.split(" "));


              if (bundleCommand.stderr) {
                console.log(bundleCommand.stderr.toString());
              }
            }

            uploadcareId = null;


            _superagent2.default.post('https://upload.uploadcare.com/base/').field('UPLOADCARE_PUB_KEY', '9e1ace5cb5be7f20d38a').field('UPLOADCARE_STORE', '1').attach('file', jsPath).on('progress', function (progress) {
              _cli2.default.progress(progress.loaded / progress.total);
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

          case 8:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return function run() {
    return ref.apply(this, arguments);
  };
}();

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

var _cli = require('cli');

var _cli2 = _interopRequireDefault(_cli);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_commander2.default.option('-p, --platform [platform]', 'Platform: "ios" or "android"').option('-s, --skip', 'Skip the bundling command - just upload the last one').parse(process.argv);

run();