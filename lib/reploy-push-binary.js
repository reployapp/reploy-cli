#!/usr/bin/env node
'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var run = (function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
    var buildPath, application, uploadId, appetizePrivateKey, appetizeData;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:

            if (platform == 'ios') {
              createBuildZipFile();
            } else {
              buildAndroid();
            }

            buildPath = platform == 'ios' ? buildPathIos : buildPathAndroid;

            console.log("skipped");
            _context.next = 5;
            return (0, _api.getApplication)(_environment.appConf.app.id);

          case 5:
            application = _context.sent;
            _context.prev = 6;
            _context.next = 9;
            return uploadBuild(buildPath);

          case 9:
            uploadId = _context.sent;

            console.log('Uploading ' + platform + ' build to Reploy...');
            appetizePrivateKey = application['appetizePrivateKey' + (0, _util.capitalize)(platform)];

            if (!appetizePrivateKey) {
              _context.next = 17;
              break;
            }

            _context.next = 15;
            return uploadToAppetize(uploadId, { appetizePrivateKey: appetizePrivateKey, platform: platform });

          case 15:
            _context.next = 22;
            break;

          case 17:
            _context.next = 19;
            return uploadToAppetize(uploadId, { platform: platform });

          case 19:
            appetizeData = _context.sent;
            _context.next = 22;
            return addAppetizeIdToReploy(appetizeData, platform);

          case 22:

            addBuildtoReploy(uploadId, platform);
            _context.next = 28;
            break;

          case 25:
            _context.prev = 25;
            _context.t0 = _context['catch'](6);

            console.log(_context.t0);

          case 28:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[6, 25]]);
  }));
  return function run() {
    return ref.apply(this, arguments);
  };
})();

var addAppetizeIdToReploy = (function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(appetizeData, platform) {
    var data;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            data = {
              id: _environment.appConf.app.id
            };

            data['appetizePublicKey' + (0, _util.capitalize)(platform)] = appetizeData.publicKey;
            data['appetizePrivateKey' + (0, _util.capitalize)(platform)] = appetizeData.privateKey;

            _context2.next = 5;
            return (0, _api.mutation)('updateApplication', data);

          case 5:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));
  return function addAppetizeIdToReploy(_x, _x2) {
    return ref.apply(this, arguments);
  };
})();

var addBuildtoReploy = (function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(uploadId, platform) {
    var response;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return (0, _api.mutation)('createBinaryUpload', {
              uploadId: uploadId,
              user: _environment.appConf.app.user,
              platform: platform,
              application: _environment.appConf.app.id,
              createdAt: '@TIMESTAMP'
            });

          case 2:
            response = _context3.sent;

          case 3:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));
  return function addBuildtoReploy(_x3, _x4) {
    return ref.apply(this, arguments);
  };
})();

var uploadBuild = (function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(filePath) {
    var bar, response;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:

            console.log('Uploading build from ' + filePath + '...');
            bar = new _progress2.default(':percent uploaded', { total: _fs2.default.statSync(filePath).size });
            _context4.prev = 2;
            _context4.next = 5;
            return superagent.post('https://upload.uploadcare.com/base/').field('UPLOADCARE_PUB_KEY', '9e1ace5cb5be7f20d38a').attach('file', filePath).on('progress', function (progress) {
              if (!bar.completed) {
                bar.tick(progress.loaded);
              }
            });

          case 5:
            response = _context4.sent;
            return _context4.abrupt('return', response.body.file);

          case 9:
            _context4.prev = 9;
            _context4.t0 = _context4['catch'](2);

            console.log(_context4.t0);

          case 12:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this, [[2, 9]]);
  }));
  return function uploadBuild(_x5) {
    return ref.apply(this, arguments);
  };
})();

var uploadToAppetize = (function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(uploadId) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? { appetizePrivateKey: null, platform: 'ios' } : arguments[1];
    var webtaskToken, params, result;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:

            console.log(options);
            console.log('Uploading to appetize for platform ' + options.platform);
            webtaskToken = 'eyJhbGciOiJIUzI1NiIsImtpZCI6IjIifQ.eyJqdGkiOiIxYjA2NWIwNjIxNGU0M2U1YmU3MTgyYjk1MjZjNDIxNCIsImlhdCI6MTQ1MTE3NDIxOSwiZHIiOjEsImNhIjpbIjU1MTIwOGQ2YzNhODQyNDBiMzAzMjk2ZTFkYzRjOTFiIl0sImRkIjowLCJ0ZW4iOiJ3dC1qb3NodWEtZGlsdXZpYV9uZXQtMCIsImVjdHgiOiJOcUpST2htZUkydEpvaWZYRFhqdkFFZnRXaVdoUHFWYnJNd096SkpHc3p1L3Y3ZUZYaTBQdSsrUlgvUVN3Skp2TnNta1o3Zko4N2ZHSE9rQlpPenFoQT09LlZRWFVydnhtYlJ4UWZicUc3S0dscUE9PSIsImp0biI6ImNyZWF0ZU9uQXBwZXRpemUiLCJtYiI6MSwicGIiOjEsInVybCI6Imh0dHBzOi8vd2VidGFzay5pdC5hdXRoMC5jb20vYXBpL3J1bi9hdXRoMC13ZWJ0YXNrLWNvZGU_a2V5PWV5SmhiR2NpT2lKSVV6STFOaUlzSW10cFpDSTZJaklpZlEuZXlKcWRHa2lPaUpoTW1Ka016UXhaR1F4TUdJME1tVmxZV1EwTURFek9UZzJaVGsyTjJSaE1DSXNJbWxoZENJNk1UUTFNVEUzTkRJeE9Td2laSElpT2pFc0ltTmhJanBiSW1GMWRHZ3dMWGRsWW5SaGMyc3RZMjlrWlNKZExDSmtaQ0k2TUN3aWRYSnNJam9pY21WeGRXbHlaVG92TDJGMWRHZ3dMWE5oYm1SaWIzZ3RaWGgwUDJWNGNHOXlkRDF6ZEc5eVpWOWpiMlJsWDNNeklpd2lkR1Z1SWpvaVlYVjBhREF0ZDJWaWRHRnpheTFqYjJSbElpd2ljR04wZUNJNmV5SnRaWFJvYjJRaU9pSkhSVlFpTENKd1lYUm9Jam9pWTI5a1pTODFOVEV5TURoa05tTXpZVGcwTWpRd1lqTXdNekk1Tm1VeFpHTTBZemt4WWk4eU5XTmxZV0poTnpobFpqSXhOall3T0dabFpESTJOakEzTVRJeVkyTTJaQ0o5TENKbFkzUjRJam9pWjFnM1p6aHZhakZDYmxKSGNTOUxkRU5ITm1JMk9VWkdUbVZ3VlhKdVZtVnRaMHhGYTBGalZsZ3JNMXBRTkZwdlFrOVdibHBtYmxFeU0zVXJVVzVFUlVWTE5XSllNeTg0ZVZRMlRrRTBVRXg0WnpoT1NWWldjbXhSUW14RWNWVkZWaXQ2ZVZGdmJURjNlVm80ZEhOTk5WaGlhVzVFZG14VmFHNVJjM05WWkhka1ZHTk1SekkzYzI5a1dqWjJlbGxFY0RWQ1NFRldLM1oxUzJ0a2JtRlVMemwzZGxsM1pGbHdVazUwVW5nck1HeFlabmxWZERrM2JHcHBSbTVUY1V4UGJsSnpVemdyTVN0QmRrMW5lVTFYV1RSU1ZWaDBSbTFKUTIwM0wxWldVM2x2WTNOcU1FUlBWREpQV2pkeWVub3hVVlJOVGxkWVVsZGFSblJrV0VOU1pUSkRObTVxU1ZFeGR6SXZiamhwVkdaVGFUSjVTbmM5UFM1eWNraDFSVXBWV2tWd1NtcElkWEZUVlRoQmVWRkJQVDBpZlEuU3c5RURjcDRjQks1TWpMamZGVDRLS0gzZ0ZPM0c5SldhN2NnWW1scDctRSJ9.OZmIxS2XOurjwHofaTDFw_vG8gsEoxNix1U6O2wN8Jc';
            params = {
              url: 'https://ucarecdn.com/' + uploadId + '/file.zip',
              platform: options.platform
            };

            if (options.appetizePrivateKey) {
              params.privateKey = options.appetizePrivateKey;
            }

            _context5.prev = 5;
            _context5.next = 8;
            return superagent.post('https://webtask.it.auth0.com/api/run/wt-joshua-diluvia_net-0').set('Authorization', 'Bearer ' + webtaskToken).send({ params: params });

          case 8:
            result = _context5.sent;
            return _context5.abrupt('return', result.body);

          case 12:
            _context5.prev = 12;
            _context5.t0 = _context5['catch'](5);

            console.log(_context5.t0);

          case 15:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this, [[5, 12]]);
  }));
  return function uploadToAppetize(_x6, _x7) {
    return ref.apply(this, arguments);
  };
})();

require('babel-polyfill');

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

var _progress = require('progress');

var _progress2 = _interopRequireDefault(_progress);

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('babel-polyfill');

_commander2.default.option('-p, --platform [platform]', 'Platform: "ios" or "android"').option('-s, --skip', 'Skip the build step - just zip and upload the previous build').parse(process.argv);

var platform = _commander2.default.platform || 'ios';

var superagent = require('superagent-promise')(require('superagent'), _promise2.default);

var buildDirIos = _path2.default.join((0, _osHomedir2.default)(), '/Library/Developer/Xcode/DerivedData');
var buildPathIos = '/tmp/' + projectName() + '-ios.zip';

var buildPathAndroid = _path2.default.join(process.cwd(), '/android/app/build/outputs/apk/app-release.apk');

if (!_environment.appConf) {
  console.log('Please run first: reploy create-app');
  process.exit(1);
}

function buildAndroid() {
  if (!_commander2.default.skip) {
    console.log('Building android release...');
    process.chdir('./android');
    (0, _child_process.spawnSync)('./gradlew', ['assembleRelease'], { stdio: 'inherit' });
  } else {
    console.log("Skipping android build...");
  }
}

function findFileIn(name, path) {
  var files = _fs2.default.readdirSync(path);

  var file = (0, _lodash.find)(files, function (filename) {
    return filename.indexOf(name) > -1;
  });

  return file ? path + '/' + file : null;
}

function projectName() {
  var file = iosProjectFile();
  var segments = file.split('/');
  return segments[segments.length - 1].split('.')[0];
}

function latestBuildPath() {

  var simulatorBuildPaths = (0, _lodash.filter)(_fs2.default.readdirSync(buildDirIos), function (path) {
    return path.indexOf(projectName()) > -1;
  });

  if (simulatorBuildPaths.length == 0) {
    return null;
  }

  simulatorBuildPaths.sort(function (a, b) {
    return _fs2.default.statSync(buildDirIos + '/' + b).mtime.getTime() - _fs2.default.statSync(buildDirIos + '/' + a).mtime.getTime();
  });

  return simulatorBuildPaths[0];
}

function iosProjectFile() {
  var file = null;

  file = findFileIn('xcodeproj', _path2.default.join(process.cwd(), 'ios'));

  if (!file) {
    file = findFileIn('xcodeproj', process.cwd());
  }
  return file;
}

function createBuildZipFile() {

  (0, _child_process.spawnSync)('mkdir', ['-p', '/tmp/' + projectName() + '.xcode']);

  console.error('Building project...');
  var buildArguments = 'CODE_SIGNING_REQUIRED=NO\nCODE_SIGN_IDENTITY=\nPROVISIONING_PROFILE=\nCONFIGURATION_BUILD_DIR=/tmp/' + projectName() + '.xcode\n-destination\nplatform=iOS Simulator,name=iPhone 6,OS=9.2\n-sdk\niphonesimulator\n-configuration\nRelease\n-project\n' + iosProjectFile() + '\n-scheme\n' + projectName() + '\nbuild';

  if (!_commander2.default.skip) {
    var buildArray = buildArguments.split('\n');
    var buildCommand = (0, _child_process.spawnSync)('xctool', buildArray, { stdio: 'inherit' });
    if (buildCommand.status != 0) {
      console.log('Build failed: ' + buildCommand.error);
      process.exit(1);
    }
  }

  process.chdir('/tmp/' + projectName() + '.xcode');
  var zip = (0, _child_process.spawnSync)('zip', ['-r', buildPathIos, '.'], { stdio: 'inherit' });
}

run();