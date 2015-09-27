'use strict';

/* jshint esnext: true, node:true */

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _cli = require('cli');

var _cli2 = _interopRequireDefault(_cli);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _validator = require('validator');

var _validator2 = _interopRequireDefault(_validator);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var withInputAsync = function withInputAsync() {
  return new _bluebird2['default'](function (resolve, reject) {
    _cli2['default'].withInput(function (line) {
      resolve(line);
    });
  });
};

exports.withInputAsync = withInputAsync;
/**
 * Reads a single line, compares it with `predicate`
 * and either outputs and error message and waits for more
 * input or resolves the promise with the valid value
 * @param  {function} predicate The predicate to use for input checking
 * @param  {string} errorMsg    The error message to show
 * @return {object}             A promise
 */
var readLine = function readLine(predicate, errorMsg) {
  return withInputAsync().then(function (input) {
    if (!predicate(input)) {
      _cli2['default'].output(errorMsg);
      return readLine(predicate, errorMsg);
    }

    return input.trim();
  });
};

var readApiIdFromCLI = function readApiIdFromCLI() {
  _cli2['default'].output('Enter your API ID:');
  return readLine(function (token) {
    return _validator2['default'].isLength(token, 16);
  }, 'Please enter a valid API ID (16 characters)');
};

exports.readApiIdFromCLI = readApiIdFromCLI;
var readApiSecretFromCLI = function readApiSecretFromCLI() {
  _cli2['default'].output('Enter your API Secret:');
  return readLine(function (token) {
    return _validator2['default'].isLength(token, 43);
  }, 'Please enter a valid API secret (43 characters)');
};

exports.readApiSecretFromCLI = readApiSecretFromCLI;
var readEmailFromCLI = function readEmailFromCLI() {
  _cli2['default'].output('Enter your email address:');
  return readLine(function (email) {
    return _validator2['default'].isEmail(email);
  }, 'Please enter a valid email address');
};

exports.readEmailFromCLI = readEmailFromCLI;
var readPasswordFromCLI = function readPasswordFromCLI() {
  _cli2['default'].output('Enter your email address:');
  return readLine(function (email) {
    return _validator2['default'].isEmail(email);
  }, 'Please enter a valid email address');
};

exports.readPasswordFromCLI = readPasswordFromCLI;
var maybeUsePackageName = function maybeUsePackageName() {
  var name = undefined;
  try {
    name = require(_path2['default'].join(process.cwd(), 'package.json')).name;
  } catch (e) {}

  if (name) {
    _cli2['default'].output('We found the following project name: ' + name + ' - do you want to use it? y/n');
    return readLine(function (input) {
      input = input.trim().toLowerCase();
      return input === 'y' || input === 'n';
    }, 'Please answer with "y" or "n"').then(function (answer) {
      return answer === 'y' ? name : void 0;
    });
  }
};
exports.maybeUsePackageName = maybeUsePackageName;