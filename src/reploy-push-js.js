#!/usr/bin/env node --harmony

import program from 'commander';
import { spawnSync } from 'child_process';
import path from 'path';
import fs  from 'fs';
import api from './api';
import {appConf, appVersion} from './environment';
import {find, filter} from 'lodash';
import homedir from 'os-homedir';
import FormData from 'form-data';
import superagent from 'superagent';
import Progress from 'progress';

const jsPath = `/tmp/${appConf.app.id}.jsbundle`;

console.log("Bundling javascript...")
let bundleCommand = spawnSync("react-native", ["bundle", "--entry-file", "./index.ios.js", "--platform", "ios", "--bundle-output", jsPath])

if (bundleCommand.stderr) {
  console.log(bundleCommand.stderr.toString())
}

let uploadcareId = null;

let bar = new Progress(':percent uploaded', { total: fs.statSync(jsPath).size });

superagent.post('https://upload.uploadcare.com/base/')
  .field("UPLOADCARE_PUB_KEY", '9e1ace5cb5be7f20d38a')
  .field("UPLOADCARE_STORE", '1')
  .attach('file', jsPath)
  .on('progress', (progress) => {
    if (!bar.complete) {
      bar.tick(progress.loaded)
    }
  })
  .end((err, response) => {
    if (err) {
      console.log(err);
    } else {
      uploadcareId = response.body.file;
      api.query(`
        mutation createJSBundle($input: _CreateJSBundleInput!) {
          createJSBundle(input: $input) {
            id,
            application {
              name
            }
          }
        }
      `, {input: {uploadId: uploadcareId, application: appConf.app.id, createdAt: "@TIMESTAMP"}})
      .then((response) => {
        console.log("Done!")
      }).catch((error) => {
        console.log(error);
      })
    }
  })
