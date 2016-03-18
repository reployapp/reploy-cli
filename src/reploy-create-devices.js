#!/usr/bin/env node --harmony

import {mutation, query, getApplication} from './api';

export const DEVICES = [
  { make: 'iphone4s', platform: 'ios', os: '8.4', label: 'iPhone4s - 8.4', width: 320, height: 480, defaultScale: "75"},
  { make: 'iphone4s', platform: 'ios', os: '9.0', label: 'iPhone4s - 9.0', width: 320, height: 480, defaultScale: "75"},
  { make: 'iphone5s', platform: 'ios', os: '8.4', label: 'iPhone5s - 8.4', width: 320, height: 568},
  { make: 'iphone5s', platform: 'ios', os: '9.0', label: 'iPhone5s - 9.0', width: 320, height: 568},
  { make: 'iphone6', platform: 'ios', os: '8.4', label: 'iPhone6 - 8.4', width: 375, height: 668},
  { make: 'iphone6', platform: 'ios', os: '9.0', label: 'iPhone6 - 9.0', width: 375, height: 668},
  { make: 'iphone6plus', platform: 'ios', os: '8.4', label: 'iPhone6+ - 8.4', width: 621, height: 1104},
  { make: 'iphone6plus', platform: 'ios', os: '9.0', label: 'iPhone6+ - 9.0', width: 621, height: 1104},
  { make: 'iphone6s', platform: 'ios', os: '9.0', label: 'iPhone6s - 9.0', width: 375, height: 627, default: true},
  { make: 'iphone6splus', platform: 'ios', os: '9.0', label: 'iPhone6s - 9.0', width: 621, height: 1104},
  { make: 'ipadair', platform: 'ios', os: '8.4', label: 'iPad Air - 8.4', width: 768, height: 1024},
  { make: 'ipadair', platform: 'ios', os: '9.0', label: 'iPad Air - 9.0', width: 768, height: 1024},
  { make: 'ipadair2', platform: 'ios', os: '9.0', label: 'iPad Air 2 - 9.0', width: 768, height: 1024},

  { make: 'nexus5', platform: 'android', os: '4.4', label: 'Nexus 5 - 4.4', width: 360, height: 640},
  { make: 'nexus5', platform: 'android', os: '5.1', label: 'Nexus 5 - 5.1', width: 360, height: 640},
  { make: 'nexus5', platform: 'android', os: '6.0', label: 'Nexus 5 - 6.0', width: 360, height: 640},
  { make: 'hammerhead', platform: 'android', os: '5.1.1', label: 'Real Nexus 5 - 6.0', width: 540, height: 960},
  { make: 'nexus7', platform: 'android', os: '4.4', label: 'Nexus 7 - 4.4', width: 600, height: 960},
  { make: 'nexus7', platform: 'android', os: '5.1', label: 'Nexus 7 - 5.1', width: 600, height: 960},
  { make: 'nexus7', platform: 'android', os: '6.0', label: 'Nexus 7 - 6.0', width: 600, height: 960, default: true},
  { make: 'nexus9', platform: 'android', os: '4.4', label: 'Nexus 9 - 4.4', width: 768, height: 1024},
  { make: 'nexus9', platform: 'android', os: '5.1', label: 'Nexus 9 - 5.1', width: 768, height: 1024},
  { make: 'nexus9', platform: 'android', os: '6.0', label: 'Nexus 9 - 6.0', width: 768, height: 1024},
];


async function createDevice(device, index, existingDevices) {
  let data = {
    order: index,
    label: device.label,
    make: device.make,
    os: device.os,
    platform: device.platform,
    width: device.width,
    height: device.height,
    createdAt: '@TIMESTAMP',
    updatedAt: '@TIMESTAMP',
    default: device.default
  };

  let existingDevice = existingDevices.find(existingDevice => existingDevice.label == device.label);

  let operation =  existingDevice ? 'update' : 'create';

  if (operation == 'update') {
    data.id = existingDevice.id;
  }

  console.log(`Processing ${operation} for ${data.label}`);
  return await mutation(`${operation}Device`, data);
}

async function run() {
  try {

    const result = await query(`
      allDevices(first: 100) {
        nodes {
          id,
          label
        }
      }
    `);

    console.log('Creating or updating devices...')
    await Promise.all(DEVICES.map((device, index) => createDevice(device, index, result.allDevices.nodes)));
    console.log('Done!');
  } catch (error) {
    console.error(error)
  }
}

run();
