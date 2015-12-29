#!/usr/bin/env node --harmony

import program from 'commander';
import { spawnSync } from 'child_process';
import path from 'path';
import {appConf, appName} from './environment';
import {mutation, query} from './api';
import readlineSync from 'readline-sync';

async function run() {
  if (appConf.app && appConf.app.id) {

    console.log("You already created this app. Its id is " + appConf.app.id);

  } else {

    let name = readlineSync.question('Give this app a name: ')
    let result = await query("user { id }")
    console.log(result.user.id)
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
  }
}

run();
