import plist from 'plist';
import path from 'path';
import config from 'home-config';
import fs from 'fs';

const ENV = process.env.REPLOY_ENV || 'production';

const FILENAME = `.reploy${ENV == 'development' ? '.development' : ''}`;
const ENDPOINT = ENV == 'development' ? 'molecular-ununpentium-702' : 'practical-improvement-29';

const appConfigPath = path.join(process.cwd(), FILENAME);

try {
  var file = fs.readFileSync(path.join(process.cwd(), 'iOS/Info.plist'), 'utf8');
  var appVersion = plist.parse(file).CFBundleShortVersionString;
} catch (e) {
  if (e.code != 'ENOENT') {
    throw e;
  }
}

const globalConf = config.load(FILENAME);

module.exports = {
  apiEndpoint: `${ENDPOINT}.myreindex.com`,
  globalConf: globalConf,
  appConf: config.load(appConfigPath),
  appVersion: appVersion || null,
  appName: path.basename(process.cwd()),
  configFilename: FILENAME,
};
