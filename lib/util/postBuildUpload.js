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
    var buildPath, uploadId, appetizeData, appetizePrivateKey;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            buildPath = options.buildPath ? _path2.default.join(_process2.default.cwd(), options.buildPath) : platform === 'ios' ? buildPathIos : buildPathAndroid;

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
            appetizeData = null;


            console.log('Uploading ' + platform + ' build to Reploy...');
            appetizePrivateKey = application['appetizePrivateKey' + (0, _util.capitalize)(platform)];

            if (!appetizePrivateKey) {
              _context.next = 18;
              break;
            }

            _context.next = 15;
            return uploadToAppetize(uploadId, { appetizePrivateKey: appetizePrivateKey, platform: platform });

          case 15:
            appetizeData = _context.sent;
            _context.next = 23;
            break;

          case 18:
            _context.next = 20;
            return uploadToAppetize(uploadId, { platform: platform });

          case 20:
            appetizeData = _context.sent;
            _context.next = 23;
            return addAppetizeIdToReploy(appetizeData, platform);

          case 23:
            addBuildtoReploy(uploadId, appetizeData, platform);
            _context.next = 29;
            break;

          case 26:
            _context.prev = 26;
            _context.t0 = _context['catch'](0);

            console.log(_context.t0);

          case 29:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 26]]);
  }));
  return function uploadBuild(_x, _x2) {
    return ref.apply(this, arguments);
  };
}();

var uploadToUploadCare = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(filePath) {
    var size, response;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            console.log('Uploading build from ' + filePath + '...');
            size = _fs2.default.statSync(filePath).size;
            _context2.prev = 2;
            _context2.next = 5;
            return superagent.post('https://upload.uploadcare.com/base/').field('UPLOADCARE_PUB_KEY', '9e1ace5cb5be7f20d38a').attach('file', filePath).on('progress', function (progress) {
              _cli2.default.progress(progress.loaded / progress.total);
            });

          case 5:
            response = _context2.sent;
            return _context2.abrupt('return', response.body.file);

          case 9:
            _context2.prev = 9;
            _context2.t0 = _context2['catch'](2);

            console.log(_context2.t0);

          case 12:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[2, 9]]);
  }));
  return function uploadToUploadCare(_x4) {
    return ref.apply(this, arguments);
  };
}();

var uploadToAppetize = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(uploadId) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? { appetizePrivateKey: null, platform: 'ios' } : arguments[1];
    var params, result;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            console.log('Finalizing upload for platform ' + options.platform);

            params = {
              url: 'https://ucarecdn.com/' + uploadId + '/file.zip',
              platform: options.platform
            };


            if (options.appetizePrivateKey) {
              params.privateKey = options.appetizePrivateKey;
            }

            _context3.prev = 3;
            _context3.next = 6;
            return superagent.post('https://webtask.it.auth0.com/api/run/wt-joshua-diluvia_net-0/createOnAppetize').send({ params: params });

          case 6:
            result = _context3.sent;
            return _context3.abrupt('return', result.body);

          case 10:
            _context3.prev = 10;
            _context3.t0 = _context3['catch'](3);

            console.log(_context3.t0);

          case 13:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this, [[3, 10]]);
  }));
  return function uploadToAppetize(_x5, _x6) {
    return ref.apply(this, arguments);
  };
}();

var addAppetizeIdToReploy = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(appetizeData, platform) {
    var data;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            console.log('adding to reploy');
            console.log(application);
            data = {
              id: application.id
            };


            data['appetizePublicKey' + (0, _util.capitalize)(platform)] = appetizeData.publicKey;
            data['appetizePrivateKey' + (0, _util.capitalize)(platform)] = appetizeData.privateKey;

            _context4.next = 7;
            return (0, _api.mutation)('updateApplication', data);

          case 7:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));
  return function addAppetizeIdToReploy(_x8, _x9) {
    return ref.apply(this, arguments);
  };
}();

var addBuildtoReploy = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(uploadId, appetizeData, platform) {
    var response;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return (0, _api.mutation)('createBinaryUpload', {
              uploadId: uploadId,
              user: application.user.id,
              platform: platform,
              application: application.id,
              versionCode: appetizeData.versionCode,
              createdAt: '@TIMESTAMP'
            });

          case 2:
            response = _context5.sent;

          case 3:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));
  return function addBuildtoReploy(_x10, _x11, _x12) {
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