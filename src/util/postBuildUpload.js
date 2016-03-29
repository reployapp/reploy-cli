import cli from 'cli';
import fs  from 'fs';
import path from 'path';
import process from 'process';
import { appConf } from '../environment';
import { capitalize, getProjectName } from '../util';
import { getApplication, query, mutation } from '../api';

const superagent = require('superagent-promise')(require('superagent'), Promise);

export const buildPathIos = `/tmp/${getProjectName()}-ios.zip`;
export const buildPathAndroid = path.join(process.cwd(), '/android/app/build/outputs/apk/app-release.apk');

export async function uploadBuild(platform, options = {}) {

  try {
    const buildPath = options.buildPath ? path.join(process.cwd(), options.buildPath) : (platform === 'ios' ? buildPathIos : buildPathAndroid);
    try {
      fs.accessSync(buildPath, fs.F_OK);
    } catch (e) {
      if (platform === 'android') {
        cli.error(`Couldn't find a signed Android APK at ${buildPath}.\n \
  Please setup Android code signing as described here: https://facebook.github.io/react-native/docs/signed-apk-android.html#content\n \
  If you have a custom build path, specify it with the -b option.`);
      } else {
        cli.error(`Couldn't find the iOS build zip file at ${buildPath}. Please contact support: support@reploy.io.`);
      }
      process.exit(1);
    }

    let application = await getApplication(appConf.app.id);

    let uploadId = await uploadToUploadCare(buildPath);
    let appetizeData = null;

    console.log(`Uploading ${platform} build to Reploy...`);
    let appetizePrivateKey = application[`appetizePrivateKey${capitalize(platform)}`];
    if (appetizePrivateKey) {
      appetizeData = await uploadToAppetize(uploadId, {appetizePrivateKey, platform});
    } else {
      appetizeData = await uploadToAppetize(uploadId, {platform});
      await addAppetizeIdToReploy(appetizeData, platform);
    }
    addBuildtoReploy(uploadId, appetizeData, platform);
  } catch (error) {
    console.log(error);
  }
}

async function uploadToUploadCare(filePath) {
  console.log(`Uploading build from ${filePath}...`)
  let size = fs.statSync(filePath).size;

  try {
    let response = await superagent.post('https://upload.uploadcare.com/base/')
      .field('UPLOADCARE_PUB_KEY', '9e1ace5cb5be7f20d38a')
      .attach('file', filePath)
      .on('progress', (progress) => {
        cli.progress(progress.loaded / progress.total);
      });

    return (response.body.file);

  } catch (error) {
    console.log(error);
  }
}

async function uploadToAppetize(uploadId, options = {appetizePrivateKey: null, platform: 'ios'}) {
  console.log(`Finalizing upload for platform ${options.platform}`);

  let params = {
    url: `https://ucarecdn.com/${uploadId}/file.zip`,
    platform: options.platform,
  };

  if (options.appetizePrivateKey) {
    params.privateKey = options.appetizePrivateKey;
  }

  try {
    let result = await superagent.post('https://webtask.it.auth0.com/api/run/wt-joshua-diluvia_net-0/createOnAppetize')
    .send({params});
    return result.body;
  } catch (error) {
    console.log(error);
  }
}

async function addAppetizeIdToReploy(appetizeData, platform) {
  let data = {
    id: appConf.app.id,
  };

  data[`appetizePublicKey${capitalize(platform)}`] = appetizeData.publicKey;
  data[`appetizePrivateKey${capitalize(platform)}`] = appetizeData.privateKey;

  await mutation('updateApplication', data);
}

async function addBuildtoReploy(uploadId, appetizeData, platform) {
  let response = await mutation('createBinaryUpload', {
    uploadId: uploadId,
    user: appConf.app.user,
    platform: platform,
    application: appConf.app.id,
    versionCode: appetizeData.versionCode,
    createdAt: '@TIMESTAMP',
  });
}
