#!/usr/bin/env node --harmony
'use strict';

var _bluebird = require('bluebird');

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var superagent = require('superagent-promise')(require('superagent'), Promise);

var buildDir = _path2.default.join((0, _osHomedir2.default)(), '/Library/Developer/Xcode/DerivedData');
var zipFile = '/tmp/' + projectName() + '.zip';

if (!_environment.appConf) {
  console.log("Please run first: reploy create-app");
  process.exit(1);
}

var run = (function () {
  var ref = (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee() {
    var application, uploadId, appetizeData;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            createBuildZipFile();

            _context.next = 3;
            return (0, _api.getApplication)(_environment.appConf.app.id);

          case 3:
            application = _context.sent;
            _context.prev = 4;
            _context.next = 7;
            return uploadBuild();

          case 7:
            uploadId = _context.sent;

            if (!application.appetizePrivateKeyIos) {
              _context.next = 13;
              break;
            }

            _context.next = 11;
            return uploadToAppetize(uploadId, application.appetizePrivateKeyIos);

          case 11:
            _context.next = 18;
            break;

          case 13:
            _context.next = 15;
            return uploadToAppetize(uploadId);

          case 15:
            appetizeData = _context.sent;
            _context.next = 18;
            return addAppetizeIdToReploy(appetizeData);

          case 18:

            console.log("Updating build on Reploy...");
            addBuildtoReploy(uploadId);
            _context.next = 25;
            break;

          case 22:
            _context.prev = 22;
            _context.t0 = _context['catch'](4);

            console.log(_context.t0);

          case 25:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[4, 22]]);
  }));
  return function run() {
    return ref.apply(this, arguments);
  };
})();

var addAppetizeIdToReploy = (function () {
  var ref = (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee2(appetizeData) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return (0, _api.mutation)('updateApplication', { id: _environment.appConf.app.id,
              appetizePublicKeyIos: appetizeData.publicKey,
              appetizePrivateKeyIos: appetizeData.privateKey });

          case 2:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));
  return function addAppetizeIdToReploy(_x) {
    return ref.apply(this, arguments);
  };
})();

var addBuildtoReploy = (function () {
  var ref = (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee3(uploadId) {
    var response;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return (0, _api.mutation)("createBinaryUpload", { uploadId: uploadId, user: _environment.appConf.app.user, application: _environment.appConf.app.id, createdAt: "@TIMESTAMP" });

          case 2:
            response = _context3.sent;

          case 3:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));
  return function addBuildtoReploy(_x2) {
    return ref.apply(this, arguments);
  };
})();

function projectName() {
  var files = _fs2.default.readdirSync(_path2.default.join(process.cwd(), 'ios'));

  var file = (0, _lodash.find)(files, function (filename) {
    return filename.indexOf("xcodeproj") > -1;
  });

  return file.split(".")[0];
}

function latestBuildPath() {

  var simulatorBuildPaths = (0, _lodash.filter)(_fs2.default.readdirSync(buildDir), function (path) {
    return path.indexOf(projectName()) > -1;
  });

  if (simulatorBuildPaths.length == 0) {
    return null;
  }

  simulatorBuildPaths.sort(function (a, b) {
    return _fs2.default.statSync(buildDir + '/' + b).mtime.getTime() - _fs2.default.statSync(buildDir + '/' + a).mtime.getTime();
  });

  return simulatorBuildPaths[0];
}

function createBuildZipFile() {

  if (!latestBuildPath()) {
    console.error("No builds available. Building now...");
    var build = (0, _child_process.spawnSync)("xctool", ["CODE_SIGNING_REQUIRED=NO", "CODE_SIGN_IDENTITY=", "PROVISIONING_PROFILE=", "-destination", "platform=iOS Simulator,name=iPhone 6,OS=9.2", "-sdk", "iphonesimulator", "-project", 'ios/' + projectName() + '.xcodeproj', "-scheme", projectName(), "build"]);
    console.log(build.stderr.toString());
    console.log(build.stdout.toString());
  }

  if (_fs2.default.existsSync(zipFile)) {
    _fs2.default.unlinkSync(zipFile);
  }
  console.log(latestBuildPath());
  process.chdir(buildDir + '/' + latestBuildPath() + '/Build/Products/Debug-iphonesimulator');
  var zip = (0, _child_process.spawnSync)('zip', ['-r', zipFile, '.']);
}

var uploadBuild = (function () {
  var ref = (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee4() {
    var bar, response;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            bar = new _progress2.default(':percent uploaded', { total: _fs2.default.statSync(zipFile).size });
            _context4.prev = 1;
            _context4.next = 4;
            return superagent.post('https://upload.uploadcare.com/base/').field("UPLOADCARE_PUB_KEY", '9e1ace5cb5be7f20d38a').attach('file', zipFile).on('progress', function (progress) {
              if (!bar.completed) {
                bar.tick(progress.loaded);
              }
            });

          case 4:
            response = _context4.sent;
            return _context4.abrupt('return', response.body.file);

          case 8:
            _context4.prev = 8;
            _context4.t0 = _context4['catch'](1);

            console.log(_context4.t0);

          case 11:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this, [[1, 8]]);
  }));
  return function uploadBuild() {
    return ref.apply(this, arguments);
  };
})();

var uploadToAppetize = (function () {
  var ref = (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee5(uploadId) {
    var appetizePrivateKey = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
    var webtaskToken, params, result;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            webtaskToken = "eyJhbGciOiJIUzI1NiIsImtpZCI6IjIifQ.eyJqdGkiOiIxYjA2NWIwNjIxNGU0M2U1YmU3MTgyYjk1MjZjNDIxNCIsImlhdCI6MTQ1MTE3NDIxOSwiZHIiOjEsImNhIjpbIjU1MTIwOGQ2YzNhODQyNDBiMzAzMjk2ZTFkYzRjOTFiIl0sImRkIjowLCJ0ZW4iOiJ3dC1qb3NodWEtZGlsdXZpYV9uZXQtMCIsImVjdHgiOiJOcUpST2htZUkydEpvaWZYRFhqdkFFZnRXaVdoUHFWYnJNd096SkpHc3p1L3Y3ZUZYaTBQdSsrUlgvUVN3Skp2TnNta1o3Zko4N2ZHSE9rQlpPenFoQT09LlZRWFVydnhtYlJ4UWZicUc3S0dscUE9PSIsImp0biI6ImNyZWF0ZU9uQXBwZXRpemUiLCJtYiI6MSwicGIiOjEsInVybCI6Imh0dHBzOi8vd2VidGFzay5pdC5hdXRoMC5jb20vYXBpL3J1bi9hdXRoMC13ZWJ0YXNrLWNvZGU_a2V5PWV5SmhiR2NpT2lKSVV6STFOaUlzSW10cFpDSTZJaklpZlEuZXlKcWRHa2lPaUpoTW1Ka016UXhaR1F4TUdJME1tVmxZV1EwTURFek9UZzJaVGsyTjJSaE1DSXNJbWxoZENJNk1UUTFNVEUzTkRJeE9Td2laSElpT2pFc0ltTmhJanBiSW1GMWRHZ3dMWGRsWW5SaGMyc3RZMjlrWlNKZExDSmtaQ0k2TUN3aWRYSnNJam9pY21WeGRXbHlaVG92TDJGMWRHZ3dMWE5oYm1SaWIzZ3RaWGgwUDJWNGNHOXlkRDF6ZEc5eVpWOWpiMlJsWDNNeklpd2lkR1Z1SWpvaVlYVjBhREF0ZDJWaWRHRnpheTFqYjJSbElpd2ljR04wZUNJNmV5SnRaWFJvYjJRaU9pSkhSVlFpTENKd1lYUm9Jam9pWTI5a1pTODFOVEV5TURoa05tTXpZVGcwTWpRd1lqTXdNekk1Tm1VeFpHTTBZemt4WWk4eU5XTmxZV0poTnpobFpqSXhOall3T0dabFpESTJOakEzTVRJeVkyTTJaQ0o5TENKbFkzUjRJam9pWjFnM1p6aHZhakZDYmxKSGNTOUxkRU5ITm1JMk9VWkdUbVZ3VlhKdVZtVnRaMHhGYTBGalZsZ3JNMXBRTkZwdlFrOVdibHBtYmxFeU0zVXJVVzVFUlVWTE5XSllNeTg0ZVZRMlRrRTBVRXg0WnpoT1NWWldjbXhSUW14RWNWVkZWaXQ2ZVZGdmJURjNlVm80ZEhOTk5WaGlhVzVFZG14VmFHNVJjM05WWkhka1ZHTk1SekkzYzI5a1dqWjJlbGxFY0RWQ1NFRldLM1oxUzJ0a2JtRlVMemwzZGxsM1pGbHdVazUwVW5nck1HeFlabmxWZERrM2JHcHBSbTVUY1V4UGJsSnpVemdyTVN0QmRrMW5lVTFYV1RSU1ZWaDBSbTFKUTIwM0wxWldVM2x2WTNOcU1FUlBWREpQV2pkeWVub3hVVlJOVGxkWVVsZGFSblJrV0VOU1pUSkRObTVxU1ZFeGR6SXZiamhwVkdaVGFUSjVTbmM5UFM1eWNraDFSVXBWV2tWd1NtcElkWEZUVlRoQmVWRkJQVDBpZlEuU3c5RURjcDRjQks1TWpMamZGVDRLS0gzZ0ZPM0c5SldhN2NnWW1scDctRSJ9.OZmIxS2XOurjwHofaTDFw_vG8gsEoxNix1U6O2wN8Jc";
            params = {
              url: 'https://ucarecdn.com/' + uploadId + '/file.zip',
              platform: "ios"
            };

            if (appetizePrivateKey) {
              params['appetizePrivateKey'] = appetizePrivateKey;
            }

            _context5.prev = 3;
            _context5.next = 6;
            return superagent.post('https://webtask.it.auth0.com/api/run/wt-joshua-diluvia_net-0').set("Authorization", 'Bearer ' + webtaskToken).send({ params: params });

          case 6:
            result = _context5.sent;
            return _context5.abrupt('return', result.body);

          case 10:
            _context5.prev = 10;
            _context5.t0 = _context5['catch'](3);

            console.log(_context5.t0);

          case 13:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this, [[3, 10]]);
  }));
  return function uploadToAppetize(_x3, _x4) {
    return ref.apply(this, arguments);
  };
})();

run();