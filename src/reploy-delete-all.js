#!/usr/bin/env node --harmony

import program from 'commander';
import { spawnSync } from 'child_process';
import path from 'path';
import {appConf, appName} from './environment';
import {query, mutation} from './api';
import 'babel-polyfill';

async function run() {
  try {
    let result = await query(`
        allReindexTypes {
          nodes {
            name
          }
        }
    `, {viewer: true});
    console.log(result.allReindexTypes.nodes);
    for (let type of result.allReindexTypes.nodes) {
      console.log(type)
      let results = await query(`
          all${type.name}s {
            nodes {
              id
            }
          }`, {viewer: true});

      if (results[`all${type.name}s`]) {
        for (let node of results[`all${type.name}s`].nodes) {
          let result = await mutation(`delete${type.name}`, {id: node.id});
          console.log(result);
        }
      }
    }

  } catch (error) {
    console.error(error);
  }
}

run();
