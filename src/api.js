import {configFilename, globalConf} from './environment';
import cli from 'cli';
import Reindex from 'reindex-js';
import process from 'process';
import {capitalize} from './util';

// TODO: setup JWT in Reindex for new users for api authentication

// if (globalConf && globalConf.auth) {
//
//   if (!globalConf.auth.apiId) {
//     cli.error(`It looks like you're not setup yet to use Reploy. Get started with: reploy setup`);
//     process.exit();
//   }
//
//   var CREDENTIALS = {"X-ApiId": globalConf.auth.apiId, "X-ApiSecret": globalConf.auth.apiSecret}
// }

const REINDEX_DATABASE = process.env['REPLOY_ENV'] === 'development' ? "molecular-ununpentium-702" : "molecular-ununpentium-702"

let db = new Reindex(`https://${REINDEX_DATABASE}.myreindex.com`);

if (process.env["REINDEX_ADMIN"]) {
  db.setToken(process.env["REINDEX_TOKEN"])
} else if (process.env["REPLOY_TOKEN"]) {
  db.setToken(process.env["REPLOY_TOKEN"])
} else {
  console.log("Please set REPLOY_TOKEN in your shell environment.")
  process.exit(1);
}

export default db;

export async function getApplication(id) {
  console.log("getApp");

  let response = await query(`
    applicationById(id: "${id}") {
      id,
      appetizePrivateKeyIos,
      appetizePrivateKeyAndroid
  }`, {viewer: false})
  return response.applicationById;
}

export async function currentUser() {
  let response = await query(`user { id }`);
  return response.user;
}

export async function query(query, options = {viewer: true}) {
  let builtQuery = options.viewer ? `{viewer{${query}}}` : `{${query}}`;
  try {
    let result = await db.query(builtQuery);
    if (result.errors) {
      console.log(result.errors);
      process.exit(1);
    } else {
      return options.viewer ? result.data.viewer : result.data;
    }
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

export async function mutation(name, input) {
  try {
    let result = await db.query(`
      mutation ${name}($input: _${capitalize(name)}Input!) {
        ${name}(input: $input) {
          id
        }
      }
    `, {input: input});

    if (result.errors) {
      console.log(result.errors);
      process.exit(1);
    } else {
      return result.data[name];
    }
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}
