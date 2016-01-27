#!/usr/bin/env node --harmony
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _bluebird = require('bluebird');

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

var _formData = require('form-data');

var _formData2 = _interopRequireDefault(_formData);

var _superagentBluebirdPromise = require('superagent-bluebird-promise');

var _superagentBluebirdPromise2 = _interopRequireDefault(_superagentBluebirdPromise);

var _progress = require('progress');

var _progress2 = _interopRequireDefault(_progress);

require('babel-polyfill');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var buildDir = _path2.default.join(process.cwd(), '/android/app/build/outputs/apk/');
var zipFile = '/tmp/' + projectName() + '-android.zip';

if (!_environment.appConf) {
  console.log("Please run first: reploy create-app");
  process.exit(1);
}

// console.log('buildDIr', buildDir);
console.log('project Name', projectName());
console.log('latestAPKBuild', latestAPKBuild());
uploadBuild();

// const uploadId = uploadBuild((uploadId) => {
//   createOnAppetize(uploadId, (response) => {
//     api.query(`
//       mutation updateApplication($input: _UpdateApplicationInput!) {
//         updateApplication(input: $input) {
//           id
//         }
//       }
//     `, {input: {id: appConf.app.id, appetizePublicKey: response.publicKey, appetizePrivateKey: response.privateKey}})
//     .then((response) => {
//         addBuildtoReploy(uploadId)
//     });
//   });
// });

function addBuildtoReploy(uploadId) {
  console.log("Updating build on Reploy...");

  _api2.default.query('\n    mutation createBinaryUpload($input: _CreateBinaryUploadInput!) {\n      createBinaryUpload(input: $input) {\n        id\n      }\n    }\n  ', { input: { uploadId: uploadId, application: _environment.appConf.app.id, createdAt: "@TIMESTAMP" } }).then(function (response) {
    console.log("Done!");
  }).catch(function (error) {
    console.log(error);
  });
}

function projectName() {
  var projectName = _fs2.default.readFileSync(process.cwd() + '/android/settings.gradle', 'utf8').toString().match(/rootProject\.name\s*=\s*['|"](.*)['|"]/);
  if (projectName) {
    return projectName[1];
  } else {
    console.log('Error: Unable to locate project name.');
  }
}

function latestAPKBuild() {

  var latestBuild = _fs2.default.readdirSync(buildDir).filter(function (file) {
    return file.substr(-4) === '.apk';
  }).sort(function (a, b) {
    return _fs2.default.statSync(buildDir + '/' + b).mtime.getTime() - _fs2.default.statSync(buildDir + '/' + a).mtime.getTime();
  });

  if (latestBuild) {
    return latestBuild[0];
  } else {
    return null;
  }
}

var uploadBuild = function () {
  var ref = (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee2(callback) {
    var _this = this;

    var _ret;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            return _context2.delegateYield(regeneratorRuntime.mark(function _callee() {
              var file, bar, response;
              return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      file = buildDir + latestAPKBuild();
                      bar = new _progress2.default(':percent uploaded', { total: _fs2.default.statSync(file).size });
                      _context.next = 4;
                      return _superagentBluebirdPromise2.default.post('https://upload.uploadcare.com/base/').field("UPLOADCARE_PUB_KEY", '9e1ace5cb5be7f20d38a').attach('file', file).on('progress', function (progress) {
                        if (!bar.completed) {
                          bar.tick(progress.loaded);
                        }
                      });

                    case 4:
                      response = _context.sent;
                      return _context.abrupt('return', {
                        v: reponse
                      });

                    case 6:
                    case 'end':
                      return _context.stop();
                  }
                }
              }, _callee, _this);
            })(), 't0', 2);

          case 2:
            _ret = _context2.t0;

            if (!((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object")) {
              _context2.next = 5;
              break;
            }

            return _context2.abrupt('return', _ret.v);

          case 5:
            _context2.next = 10;
            break;

          case 7:
            _context2.prev = 7;
            _context2.t1 = _context2['catch'](0);

            console.error(_context2.t1);

          case 10:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[0, 7]]);
  }));
  return function uploadBuild(_x) {
    return ref.apply(this, arguments);
  };
}();

function createOnAppetize(uploadId, callback) {
  console.log("Creating on appetize...");
  _superagentBluebirdPromise2.default.post('https://webtask.it.auth0.com/api/run/wt-joshua-diluvia_net-0').set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsImtpZCI6IjIifQ.eyJqdGkiOiI5YzliOWVhOGUxNzQ0OWRmYTk2ZTA2YTNlMzkxZGRmNSIsImlhdCI6MTQ1MDI5MDY3MCwiZHIiOjEsImNhIjpbIjU1MTIwOGQ2YzNhODQyNDBiMzAzMjk2ZTFkYzRjOTFiIl0sImRkIjowLCJ0ZW4iOiJ3dC1qb3NodWEtZGlsdXZpYV9uZXQtMCIsImVjdHgiOiJZRUpEd1BlZnFaVDNXcEVtL0NBMHVETDdEV3ZkS1dkckZ6b09UcGVkelVYNEVjb0p3b2I4V010QVJ3VWNubFZVcmhEc2p3aGUzYzVnL0g5a25CeEx1dz09LlRIc2hKbDBmQVNGdXVqK3cwOW1sakE9PSIsImp0biI6ImNyZWF0ZU9uQXBwZXRpemUiLCJtYiI6MSwicGIiOjEsInVybCI6Imh0dHBzOi8vd2VidGFzay5pdC5hdXRoMC5jb20vYXBpL3J1bi9hdXRoMC13ZWJ0YXNrLWNvZGU_a2V5PWV5SmhiR2NpT2lKSVV6STFOaUlzSW10cFpDSTZJaklpZlEuZXlKcWRHa2lPaUl6TkRWaU1HUTNNalpsTXpnMFlUVTVZak0wWlRSbU5EZGhNRFZoTXprNVl5SXNJbWxoZENJNk1UUTFNREk1TURZM01Dd2laSElpT2pFc0ltTmhJanBiSW1GMWRHZ3dMWGRsWW5SaGMyc3RZMjlrWlNKZExDSmtaQ0k2TUN3aWRYSnNJam9pY21WeGRXbHlaVG92TDJGMWRHZ3dMWE5oYm1SaWIzZ3RaWGgwUDJWNGNHOXlkRDF6ZEc5eVpWOWpiMlJsWDNNeklpd2lkR1Z1SWpvaVlYVjBhREF0ZDJWaWRHRnpheTFqYjJSbElpd2ljR04wZUNJNmV5SnRaWFJvYjJRaU9pSkhSVlFpTENKd1lYUm9Jam9pWTI5a1pTODFOVEV5TURoa05tTXpZVGcwTWpRd1lqTXdNekk1Tm1VeFpHTTBZemt4WWk4ek16YzBOakE1WWpNelpqWXhOVGhqWXpoaE5Ua3dNekV5TVRVek5ERTNPQ0o5TENKbFkzUjRJam9pUkRsamJWRnVUM1JaVURCNFVUTk5UMlJsTVdKeFpWVXhlbGgwSzJGQ1EyazBTWGhPU2pOcGNFZDFNMnhKU21sS1JHZ3pWWFpuV1U1MU1sazNXRkpJTld3dmFUQkJOa2gwYjNkSGRTOXVObGRHV2xSck0wMWhOa2MyVVRRMmJESjJSSFJzTTB3NFdYVkJaVVZIVTJWSFRFcGllbmR0VmpCQlJscEhaWFUyUzBWcVIybEVZekJRY20xa1VtUlBiWFZ5UTBweWQwVXJWMjlhUkRKU09GWllkRkJaVWtjdk5sZzBWRnAyV1RCR1NFdFdiSE5PV0c0MGFGSkJZVFJ0SzJKUmRqbFlaRTVaTUU1dU5FZzBhSEUwU0VKSllVbFNOV1J3VlZGTk4zSkdTR3RuV2tJclJWUjNUMWRvYnpWb1ZVdE1lRWR0TjNjNFpUQnRkbUZ4WVU1bU4yeDRkbE4zZUdSUGEyRlBWelJGVG1sV1pFSlRRM2M5UFM1blF5OVZWRTV1Y25Sc1dIZGtZUzlhYkVKd2VUTlJQVDBpZlEuRUxwQVczWmQ4dVNyQzlXY2EwYXpkUms4dlZDc0UyWXJ2Vk92dUMySHo2dyJ9.u-ZBcycHoVlwjaZqg7XPvuK2BU8zlXJZ6qgvQAbco2s").send({ uploadId: uploadId }).end(function (err, response) {
    if (err) {
      console.log(err);
    } else {
      console.log("Created!");
      callback(response.body.file);
    }
  });
}