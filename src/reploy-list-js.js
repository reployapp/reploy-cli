#!/usr/bin/env node --harmony

import program from 'commander';
import config from 'home-config';
import {globalConf, appConf, appVersion} from './environment';
import timeago from 'timeago';
import api from './api';

if (!appConf.app) {

  console.log("You need to create this app first with: reploy create");

} else {

  api.get(`/apps/${appConf.app.id}/js_versions`)
    .then((response) => {
      response.body.map((version) => {
        console.log(`${version.version_number} ${version.bundle_hash} ${timeago(new Date(version.created_at))}`);
      });
    }, (error) => {
      console.log('Error!');
      console.log(response);
    });

}
