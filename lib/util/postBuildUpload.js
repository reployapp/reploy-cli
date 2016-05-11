'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uploadBuild = exports.buildPathAndroid = exports.buildPathIos = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var uploadBuild = exports.uploadBuild = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(platform) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var buildPath, uploadId;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            buildPath = options.buildPath ? options.buildPath : platform === 'ios' ? buildPathIos : buildPathAndroid;

            try {
              _fs2.default.accessSync(buildPath, _fs2.default.F_OK);
            } catch (e) {
              if (platform === 'android') {
                _cli2.default.error('Couldn\'t find a signed Android APK at ' + buildPath + '.\n   Please setup Android code signing as described here: https://facebook.github.io/react-native/docs/signed-apk-android.html#content\n   If you have a custom build path, specify it with the -b option.');
              } else {
                _cli2.default.error('Couldn\'t find the iOS build zip file at ' + buildPath + '. Please contact support: support@reploy.io.');
              }
              _process2.default.exit(1);
            }

            _context.next = 5;
            return (0, _api.getApplication)(options.applicationId);

          case 5:
            application = _context.sent;
            _context.next = 8;
            return uploadToUploadCare(buildPath);

          case 8:
            uploadId = _context.sent;

            addBuildtoReploy(uploadId, platform, options.name);
            _context.next = 15;
            break;

          case 12:
            _context.prev = 12;
            _context.t0 = _context['catch'](0);

            console.log(_context.t0);

          case 15:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 12]]);
  }));
  return function uploadBuild(_x, _x2) {
    return ref.apply(this, arguments);
  };
}();

var uploadToUploadCare = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(filePath) {
    var response;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            console.log('Uploading build from ' + filePath + '...');

            _context2.prev = 1;
            _context2.next = 4;
            return superagent.post('https://upload.uploadcare.com/base/').field('UPLOADCARE_PUB_KEY', '9e1ace5cb5be7f20d38a').attach('file', filePath).on('progress', function (progress) {
              _cli2.default.progress(progress.loaded / progress.total);
            });

          case 4:
            response = _context2.sent;
            return _context2.abrupt('return', response.body.file);

          case 8:
            _context2.prev = 8;
            _context2.t0 = _context2['catch'](1);

            console.log(_context2.t0);

          case 11:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[1, 8]]);
  }));
  return function uploadToUploadCare(_x4) {
    return ref.apply(this, arguments);
  };
}();

var addBuildtoReploy = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(uploadId, platform) {
    var name = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return (0, _api.mutation)('createBinaryUpload', {
              uploadId: uploadId,
              user: application.user.id,
              platform: platform,
              name: name,
              application: application.id,
              createdAt: '@TIMESTAMP'
            });

          case 3:
            _context3.next = 8;
            break;

          case 5:
            _context3.prev = 5;
            _context3.t0 = _context3['catch'](0);

            console.log(_context3.t0);

          case 8:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this, [[0, 5]]);
  }));
  return function addBuildtoReploy(_x5, _x6, _x7) {
    return ref.apply(this, arguments);
  };
}();

var _cli = require('cli');

var _cli2 = _interopRequireDefault(_cli);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _process = require('process');

var _process2 = _interopRequireDefault(_process);

var _environment = require('../environment');

var _util = require('../util');

var _api = require('../api');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var superagent = require('superagent-promise')(require('superagent'), _promise2.default);

var buildPathIos = exports.buildPathIos = '/tmp/' + (0, _util.getProjectName)() + '-ios.zip';
var buildPathAndroid = exports.buildPathAndroid = _path2.default.join(_process2.default.cwd(), '/android/app/build/outputs/apk/app-release.apk');

var application = null;