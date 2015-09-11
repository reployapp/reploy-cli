#!/usr/bin/env node --harmony

import program from 'commander';
import { spawnSync } from 'child_process';
import path from 'path';
import fs  from 'fs';
import api from './api';
import {appConf, appVersion} from './environment';

program
  .option('-r, --release_notes [notes]', 'Release notes for this version', null)
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

api.post(`/apps/${appConf.app.id}/js_versions`, {
           fields: [
             {name: 'release_notes',
              value: program.release_notes}],
           attachments: [
             {field: 'jsbundle', path: path.join(process.cwd(), 'iOS/main.jsbundle')},
             {field: 'package_json', path: path.join(process.cwd(), 'package.json')}
           ]
    })
    .then((response) => {
      console.log('Version number: ' + response.body.version_number)
      console.log('Bundle hash: ' + response.body.bundle_hash)
    }, (response) => {
      if (response.body && response.body.errors) {
        console.log(response.body.errors)
      } else {
        console.log(response.res.error)
      }
    });
