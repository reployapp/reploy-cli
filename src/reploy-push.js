#!/usr/bin/env node --harmony

import program from 'commander';
import { spawnSync } from 'child_process';
import path from 'path';
import config from 'home-config';
import fs  from 'fs';
import request from 'superagent';
import {appConf, appVersion} from './environment';

program
  .option('-s, --skip_bundle', 'Skip javascript bundle step')
  .parse(process.argv);


if (program.skip_bundle) {
  console.log("Skipping javascript bundle step.")
} else {
  console.log("Starting bundle...");
  var bundle = spawnSync('node', [path.join(process.cwd(), 'node_modules/react-native/local-cli/cli.js'), 'bundle']);
  console.log(bundle.stdout.toString());
}

console.log("Uploading bundle...")
var url = `http://reploy.io/apps/${appConf.app.id}/${appVersion}/js_versions`;

request
  .post(url)
  .attach('jsbundle', path.join(process.cwd(), 'iOS/main.jsbundle'))
  .end(function(err, res) {
    if (res.ok) {
     console.log('Done!')
     console.log(JSON.stringify(res.body));
    } else {
     console.log(res.body);
    }
  });
