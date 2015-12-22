#!/usr/bin/env node --harmony

import program from 'commander';
import { spawnSync } from 'child_process';
import path from 'path';
import {appConf, appName} from './environment';
import api from './api';
import 'babel-polyfill';

async function run() {
  try {
    let result = await api.query(`{
      viewer {
        allReindexTypes {
          nodes {
            name
          }
        }
      }
    }
    `);

    for (let type of result.data.viewer.allReindexTypes.nodes) {
      console.log(type.name)
      let results = await api.query(`{
        viewer {
          allUsers {
            nodes {
              id
            }
          }
        }
      }`);

      if (results.data.viewer[`all${type.name}s`]) {
        for (let node of results.data.viewer[`all${type.name}s`].nodes) {
          api.query(`
            mutation deleteNode($input: _Delete${type}Input!) {
              deleteApplication(input: $input) {
                id
              }
            }
          `, {input: {id: node.id}})
        }        
      }
    }

  } catch (error) {
    console.error(error)
  }
}

run();
