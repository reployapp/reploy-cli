#!/usr/bin/env node --harmony
'use strict';

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _api = require('./api');

var _api2 = _interopRequireDefault(_api);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_api2.default.query('query {\n  viewer {\n    allApplications {\n      edges {\n        node {\n          name\n        }\n      }\n    }\n  }\n}').then(function (result) {
  result.data.viewer.allApplications.edges.forEach(function (app) {
    console.log(app.node.name);
  });
}).catch(function (error) {
  console.log(error);
});