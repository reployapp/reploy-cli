import {apiEndpoint, configFilename, globalConf, appConf} from './environment';
import cli from 'cli';
import Reindex from 'reindex-js';
import process from 'process';
import {capitalize} from './util';

const db = new Reindex(`https://${apiEndpoint}`);

db.setToken(globalConf.token);

export default db;

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
