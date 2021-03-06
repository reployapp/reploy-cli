import {apiEndpoint, globalConf, appConf} from './environment';
import Reindex from 'reindex-js';
import {capitalize} from './util';

const db = new Reindex(`https://${apiEndpoint}`);

db.setToken(globalConf.token);

export default db;

export const request = require('superagent-promise')(require('superagent'), Promise);

export async function getApplication(id = null) {
  let response = await query(`
    applicationByUrlToken(urlToken: "${id || appConf.app.id}") {
      id,
      urlToken,
      appetizePrivateKeyIos,
      appetizePrivateKeyAndroid,
      user {
        id
      }
  }`, {viewer: false});
  return response.applicationByUrlToken;
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

async function fixAppId() {
  // temporary, until everyone stops using the old app ID format
  if (appConf && appConf.app.id && appConf.app.id.length > 10) {
    let result = await query(`applicationById(id: "${appConf.app.id}") { urlToken }`, {viewer: false});
    appConf.app = {
      id: result.applicationById.urlToken
    }
    appConf.save();
  }
}

fixAppId();
