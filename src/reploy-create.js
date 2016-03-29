#!/usr/bin/env node --harmony

import path from 'path';
import program from 'commander';
import readlineSync from 'readline-sync';

import { appConf, appName} from './environment';
import { mutation, query} from './api';
import { checkForReact } from './util';
import { spawnSync } from 'child_process';
import {platformPrompt} from './util';

async function run() {
  if (!checkForReact()) {
    console.log("Did you mean to run this inside a react-native project? ");
  } else if (appConf.app && appConf.app.id) {
    console.log("You already created this app. Its id is " + appConf.app.id);
  } else {

    let name = readlineSync.question('Give this app a name: ')
    let result = await query("user { id }")
    let app = await mutation("createApplication", {
      name: name,
      user: result.user.id,
      createdAt: '@TIMESTAMP',
      updatedAt: '@TIMESTAMP',
    });

    appConf.app = {
      id: app.id,
      user: result.user.id
    }

    appConf.save()

    console.log(`Created app with name ${name} and id ${app.id}`)
    if (readlineSync.keyInYN('Do you want to build and push this project to Reploy?')) {
      let platform = platformPrompt();
      spawnSync('reploy', ['push-build', '-p', platform], {stdio: 'inherit'});
    } else {
      process.exit(1);
    }

  }
}

run();
