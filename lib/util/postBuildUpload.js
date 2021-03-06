'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uploadBuild = exports.buildPathAndroid = exports.buildPathIos = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var uploadBuild = exports.uploadBuild = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(platform) {
    var _this = this;

    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            return _context2.delegateYield(_regenerator2.default.mark(function _callee() {
              var buildPath, uploadId;
              return _regenerator2.default.wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
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

                      _context.next = 4;
                      return (0, _api.getApplication)(options.applicationId);

                    case 4:
                      application = _context.sent;
                      _context.next = 7;
                      return uploadToUploadCare(buildPath);

                    case 7:
                      uploadId = _context.sent;

                      setTimeout(function () {
                        return addBuildtoReploy(uploadId, platform, options.name, options.url);
                      }, 8000);

                    case 9:
                    case 'end':
                      return _context.stop();
                  }
                }
              }, _callee, _this);
            })(), 't0', 2);

          case 2:
            _context2.next = 7;
            break;

          case 4:
            _context2.prev = 4;
            _context2.t1 = _context2['catch'](0);

            console.log(_context2.t1);

          case 7:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[0, 4]]);
  }));
  return function uploadBuild(_x, _x2) {
    return ref.apply(this, arguments);
  };
}();

var uploadToUploadCare = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(filePath) {
    var response;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            console.log('Uploading build from ' + filePath + '...');

            _context3.prev = 1;
            _context3.next = 4;
            return _api.request.post('https://upload.uploadcare.com/base/').field('UPLOADCARE_PUB_KEY', '9e1ace5cb5be7f20d38a').attach('file', filePath).on('progress', function (progress) {
              _cli2.default.progress(progress.loaded / progress.total);
            });

          case 4:
            response = _context3.sent;
            return _context3.abrupt('return', response.body.file);

          case 8:
            _context3.prev = 8;
            _context3.t0 = _context3['catch'](1);

            console.log(_context3.t0);

          case 11:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this, [[1, 8]]);
  }));
  return function uploadToUploadCare(_x4) {
    return ref.apply(this, arguments);
  };
}();

var addBuildtoReploy = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(uploadId, platform, name, url) {
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _context4.next = 3;
            return (0, _api.mutation)('createBinaryUpload', {
              uploadId: uploadId,
              user: application.user.id,
              platform: platform,
              name: name,
              url: url,
              application: application.id,
              createdAt: '@TIMESTAMP'
            });

          case 3:
            _context4.next = 8;
            break;

          case 5:
            _context4.prev = 5;
            _context4.t0 = _context4['catch'](0);

            console.log(_context4.t0);

          case 8:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this, [[0, 5]]);
  }));
  return function addBuildtoReploy(_x5, _x6, _x7, _x8) {
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

var _util = require('../util');

var _api = require('../api');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var buildPathIos = exports.buildPathIos = '/tmp/' + (0, _util.getProjectName)() + '-ios.zip';
var buildPathAndroid = exports.buildPathAndroid = _path2.default.join(_process2.default.cwd(), '/android/app/build/outputs/apk/app-release.apk');

var application = null;