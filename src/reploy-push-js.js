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

let file = `${process.cwd()}/ios/main.jsbundle`;

let uploadcareId = null;

let bar = new Progress(':percent uploaded', { total: fs.statSync(file).size });

superagent.post('https://upload.uploadcare.com/base/')
  .field("UPLOADCARE_PUB_KEY", '9e1ace5cb5be7f20d38a')
  .attach('file', file)
  .on('progress', (progress) => {

    if (!bar.complete) {
      bar.tick(progress.loaded)
    } else {
      console.log("Waiting for upload to be processed...")
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
        console.log(response)
        console.log("JSBundle uploaded!")
      }).catch((error) => {
        console.log(error);
      })
    }
  })
