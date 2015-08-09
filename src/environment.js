import plist from 'plist';
import path from 'path';
import config from 'home-config';
import fs  from 'fs';

module.exports = {
  globalConf: config.load(".reploy"),
  appConf: config.load(path.join(process.cwd(), ".reploy")),
  appVersion: plist.parse(fs.readFileSync(path.join(process.cwd(), 'iOS/Info.plist'), 'utf8')).CFBundleShortVersionString,
  appName: path.basename(process.cwd())
}
