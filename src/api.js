import {configFilename, globalConf} from './environment';
import cli from 'cli';
import Reindex from 'reindex-js';
import process from 'process';
import {capitalize} from './util';

var REINDEX_DATABASE = 'molecular-ununpentium-702';
var REINDEX_TOKEN = process.env.REINDEX_TOKEN_DEV;
var REPLOY_TOKEN = process.env.REPLOY_TOKEN_DEV;

if (process.env.REPLOY_ENV == 'production') {
  var REINDEX_DATABASE = 'practical-improvement-29';
  var REINDEX_TOKEN = process.env.REINDEX_TOKEN_PROD;
  var REPLOY_TOKEN = process.env.REPLOY_TOKEN;
}

const db = new Reindex(`https://${REINDEX_DATABASE}.myreindex.com`);
const TOKEN = process.env.REPLOY_ADMIN ? REINDEX_TOKEN : REPLOY_TOKEN;

if (!TOKEN) {
  if (!process.env.REPLOY_ADMIN) {
    console.log('Please set REPLOY_TOKEN in your shell environment. You\'ll find that token in your Settings page: https://app.reploy.io/settings.');
  } else {
    console.log('Please set REPLOY_TOKEN_DEV and REPLOY_TOKEN_PROD in your shell environment');
  }
  process.exit(1);
}

db.setToken(TOKEN);

export default db;

export async function getApplication(id) {
  let response = await query(`
    applicationById(id: "${id}") {
      id,
      appetizePrivateKeyIos,
      appetizePrivateKeyAndroid
  }`, {viewer: false});
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
