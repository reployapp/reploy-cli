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

var buildDir = _path2.default.join((0, _osHomedir2.default)(), '/Library/Developer/Xcode/DerivedData');
var zipFile = '/tmp/' + projectName() + '.zip';

if (!_environment.appConf) {
  console.log("Please run first: reploy create-app");
  process.exit(1);
}

createBuildZipFile();

var uploadId = uploadBuild(function (uploadId) {

  createOnAppetize(uploadId, function (response) {
    _api2.default.query('\n      mutation updateApplication($input: _UpdateApplicationInput!) {\n        updateApplication(input: $input) {\n          id\n        }\n      }\n    ', { input: { id: _environment.appConf.app.id, appetizePublicKey: response.publicKey, appetizePrivateKey: response.privateKey } }).then(function (response) {
      addBuildtoReploy(uploadId);
    });
  });
});

function addBuildtoReploy(uploadId) {
  console.log("Updating build on Reploy...");

  _api2.default.query('\n    mutation createBinaryUpload($input: _CreateBinaryUploadInput!) {\n      createBinaryUpload(input: $input) {\n        id\n      }\n    }\n  ', { input: { uploadId: uploadId, application: _environment.appConf.app.id, createdAt: "@TIMESTAMP" } }).then(function (response) {
    console.log("Done!");
  }).catch(function (error) {
    console.log(error);
  });
}

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

function uploadBuild(callback) {

  var bar = new _progress2.default(':percent uploaded', { total: _fs2.default.statSync(zipFile).size });

  _superagent2.default.post('https://upload.uploadcare.com/base/').field("UPLOADCARE_PUB_KEY", '9e1ace5cb5be7f20d38a').attach('file', zipFile).on('progress', function (progress) {
    if (!bar.completed) {
      bar.tick(progress.loaded);
    }
  }).end(function (err, response) {
    if (err) {
      console.log(err);
      process.exit(1);
    } else {
      callback(response.body.file);
    }
  });
}

function createOnAppetize(uploadId, callback) {
  console.log("Creating on appetize...");
  _superagent2.default.post('https://webtask.it.auth0.com/api/run/wt-joshua-diluvia_net-0').set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsImtpZCI6IjIifQ.eyJqdGkiOiI5YzliOWVhOGUxNzQ0OWRmYTk2ZTA2YTNlMzkxZGRmNSIsImlhdCI6MTQ1MDI5MDY3MCwiZHIiOjEsImNhIjpbIjU1MTIwOGQ2YzNhODQyNDBiMzAzMjk2ZTFkYzRjOTFiIl0sImRkIjowLCJ0ZW4iOiJ3dC1qb3NodWEtZGlsdXZpYV9uZXQtMCIsImVjdHgiOiJZRUpEd1BlZnFaVDNXcEVtL0NBMHVETDdEV3ZkS1dkckZ6b09UcGVkelVYNEVjb0p3b2I4V010QVJ3VWNubFZVcmhEc2p3aGUzYzVnL0g5a25CeEx1dz09LlRIc2hKbDBmQVNGdXVqK3cwOW1sakE9PSIsImp0biI6ImNyZWF0ZU9uQXBwZXRpemUiLCJtYiI6MSwicGIiOjEsInVybCI6Imh0dHBzOi8vd2VidGFzay5pdC5hdXRoMC5jb20vYXBpL3J1bi9hdXRoMC13ZWJ0YXNrLWNvZGU_a2V5PWV5SmhiR2NpT2lKSVV6STFOaUlzSW10cFpDSTZJaklpZlEuZXlKcWRHa2lPaUl6TkRWaU1HUTNNalpsTXpnMFlUVTVZak0wWlRSbU5EZGhNRFZoTXprNVl5SXNJbWxoZENJNk1UUTFNREk1TURZM01Dd2laSElpT2pFc0ltTmhJanBiSW1GMWRHZ3dMWGRsWW5SaGMyc3RZMjlrWlNKZExDSmtaQ0k2TUN3aWRYSnNJam9pY21WeGRXbHlaVG92TDJGMWRHZ3dMWE5oYm1SaWIzZ3RaWGgwUDJWNGNHOXlkRDF6ZEc5eVpWOWpiMlJsWDNNeklpd2lkR1Z1SWpvaVlYVjBhREF0ZDJWaWRHRnpheTFqYjJSbElpd2ljR04wZUNJNmV5SnRaWFJvYjJRaU9pSkhSVlFpTENKd1lYUm9Jam9pWTI5a1pTODFOVEV5TURoa05tTXpZVGcwTWpRd1lqTXdNekk1Tm1VeFpHTTBZemt4WWk4ek16YzBOakE1WWpNelpqWXhOVGhqWXpoaE5Ua3dNekV5TVRVek5ERTNPQ0o5TENKbFkzUjRJam9pUkRsamJWRnVUM1JaVURCNFVUTk5UMlJsTVdKeFpWVXhlbGgwSzJGQ1EyazBTWGhPU2pOcGNFZDFNMnhKU21sS1JHZ3pWWFpuV1U1MU1sazNXRkpJTld3dmFUQkJOa2gwYjNkSGRTOXVObGRHV2xSck0wMWhOa2MyVVRRMmJESjJSSFJzTTB3NFdYVkJaVVZIVTJWSFRFcGllbmR0VmpCQlJscEhaWFUyUzBWcVIybEVZekJRY20xa1VtUlBiWFZ5UTBweWQwVXJWMjlhUkRKU09GWllkRkJaVWtjdk5sZzBWRnAyV1RCR1NFdFdiSE5PV0c0MGFGSkJZVFJ0SzJKUmRqbFlaRTVaTUU1dU5FZzBhSEUwU0VKSllVbFNOV1J3VlZGTk4zSkdTR3RuV2tJclJWUjNUMWRvYnpWb1ZVdE1lRWR0TjNjNFpUQnRkbUZ4WVU1bU4yeDRkbE4zZUdSUGEyRlBWelJGVG1sV1pFSlRRM2M5UFM1blF5OVZWRTV1Y25Sc1dIZGtZUzlhYkVKd2VUTlJQVDBpZlEuRUxwQVczWmQ4dVNyQzlXY2EwYXpkUms4dlZDc0UyWXJ2Vk92dUMySHo2dyJ9.u-ZBcycHoVlwjaZqg7XPvuK2BU8zlXJZ6qgvQAbco2s").send({ uploadId: uploadId }).end(function (err, response) {
    if (err) {
      console.log(err);
    } else {
      console.log("Created!");
      callback(response.body);
    }
  });
}