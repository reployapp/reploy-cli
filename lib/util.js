'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.capitalize = capitalize;
exports.checkForReact = checkForReact;
exports.getXcodeProject = getXcodeProject;
exports.getProjectName = getProjectName;
exports.getSimulatorBuilds = getSimulatorBuilds;
exports.getDefaultSimulator = getDefaultSimulator;
exports.latestBuildPath = latestBuildPath;

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _osHomedir = require('os-homedir');

var _osHomedir2 = _interopRequireDefault(_osHomedir);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _cli = require('cli');

var _cli2 = _interopRequireDefault(_cli);

var _findXcodeProject = require('./util/findXcodeProject');

var _findXcodeProject2 = _interopRequireDefault(_findXcodeProject);

var _parseIOSSimulatorsList = require('./util/parseIOSSimulatorsList');

var _parseIOSSimulatorsList2 = _interopRequireDefault(_parseIOSSimulatorsList);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var buildDirIos = _path2.default.join((0, _osHomedir2.default)(), '/Library/Developer/Xcode/DerivedData');

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function checkForReact() {
  // @TODO Super basic. Can get more elaborate as needed.
  if (!_fs2.default.existsSync('./node_modules/react-native')) {
    _cli2.default.error('Did you mean to run this inside a react-native project?');
    process.exit(1);
  } else {
    return;
  }
}

function getXcodeProject() {
  if (_fs2.default.existsSync('./ios')) {
    var xcodeProject = (0, _findXcodeProject2.default)(_fs2.default.readdirSync('./ios'));
    if (!xcodeProject) {
      _cli2.default.error('Could not find Xcode project files in ios folder');
    } else {
      return xcodeProject;
    }
  } else {
    _cli2.default.error('Unable to locate \'ios\' directory.\nRun this command from the root directory of your React Native project.');
  }
}

function getProjectName() {
  var file = getXcodeProject();
  if (file) {
    var segments = file.name.split('/');
    return segments[segments.length - 1].split('.')[0];
  }
}

function getSimulatorBuilds() {
  return (0, _parseIOSSimulatorsList2.default)(_child_process2.default.execFileSync('xcrun', ['simctl', 'list', 'devices'], { encoding: 'utf8' }));
}

function getDefaultSimulator() {
  var simulators = getSimulatorBuilds();

  // @TODO:
  // Do we want to expose this as a build option by listing the
  // available simulators from our util function?

  var selectedSimulator = simulators.find(function (sim) {
    return sim.name === 'iPhone 6';
  });

  if (!selectedSimulator) {
    throw new Error('Cound\'t find ' + args.simulator + ' simulator');
  } else {
    return selectedSimulator;
  }
}

function latestBuildPath() {
  var simulatorBuildPaths = filter(_fs2.default.readdirSync(buildDirIos), function (path) {
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