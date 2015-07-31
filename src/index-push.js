#!/usr/bin/env node --harmony

import program from 'commander';
import { spawnSync } from 'child_process';
import path from 'path';
import config from 'home-config';
import fs  from 'fs';
import plist from 'plist';
import request from 'superagent';

var appConf = config.load(path.join(process.cwd(), ".reploy"));

// console.log("Starting bundle")
// var bundle = spawnSync('node', [path.join(process.cwd(), 'node_modules/react-native/local-cli/cli.js'), 'bundle']);
// console.log(bundle.stdout.toString());

var appPlist = plist.parse(fs.readFileSync(path.join(process.cwd(), 'iOS/Info.plist'), 'utf8'));

request
  .post(`http://reploy.io/apps/${appConf.app.id}/${appPlist.CFBundleShortVersionString}/js_versions`)
  .attach('jsbundle', path.join(process.cwd(), 'iOS/main.jsbundle'))
  .end(function(err, res) {
    if (res.ok) {
     console.log('yay got ' + JSON.stringify(res.body));
    } else {
     console.log('Oh no! error ' + res.text);
    }
  });
