import {configFilename, globalConf} from './environment';
import cli from 'cli';
import Reindex from 'reindex-js';

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

const REINDEX_DATABASE = process.env['REPLOY_ENV'] === 'development' ? "practical-improvement-29" : "practical-improvement-29"

let db = new Reindex(`https://${REINDEX_DATABASE}.myreindex.com`);
export default db;

export function getApplication(id) {
  db.query(`{
    getApplication(id: ${id}) {
      id,
      appetizeId
    }
  }`)
  .then((response) => {
    return response.data.getApplication
  })
  .catch((error) => {
    console.log(error)
  })
}
