#!/usr/bin/env node --harmony

import program from 'commander';
import { spawnSync } from 'child_process';
import path from 'path';
import config from 'home-config';
import fs  from 'fs';
import request from 'superagent';
import {appConf, appVersion} from './environment';

// console.log("Starting bundle")
// var bundle = spawnSync('node', [path.join(process.cwd(), 'node_modules/react-native/local-cli/cli.js'), 'bundle']);
// console.log(bundle.stdout.toString());

var url = `http://reploy.io/apps/${appConf.app.id}/${appVersion}/js_versions`;
console.log(url);
request
  .post(url)
  .attach('jsbundle', path.join(process.cwd(), 'iOS/main.jsbundle'))
  .end(function(err, res) {
    if (res.ok) {
     console.log('yay got ' + JSON.stringify(res.body));
    } else {
     console.log('Oh no! error ' + res.text);
    }
  });
