import chalk from "chalk";
import semver from "semver";
import Serial from "../serial";

import ora, { Ora } from "ora";

export default async (obj: { portname: string; debugserial: any; stdout: any; configs: any; via: string }) => {
  // Return if no configs required
  if (!obj.configs) {
    return;
  }

  const serial = new Serial({
    portname: obj.portname,
    stdout: (text) => {
      if (obj.debugserial) {
        console.log(text);
      }
      received += text;
      obj.stdout(text);
    },
    onerror: (err) => {
      received += err;
      console.log(serial.totalReceived);
      throw new Error(`${err}`);
    },
    progress: (text: string, option: any = {}) => {
      if (obj.debugserial) {
        console.log(text);
        return;
      }
      if (option.keep) {
        spinner.text = text;
      } else {
        spinner = nextSpinner(spinner, `Configure: ${text}`, obj.debugserial);
      }
    },
  });
  let received = "";
  let spinner = ora(`Configure: Opening Serial Port ${chalk.green(obj.portname)}`).start();
  if (obj.debugserial) {
    spinner.stop();
  }
  try {
    await serial.open();

    // config devicekey
    if (obj.configs.devicekey) {
      await serial.setDeviceKey(obj.configs.devicekey);
    }

    // config network
    if (obj.configs.config) {
      // JSON provided by user
      const userconf = obj.configs.config;

      // detect Target obnizOS
      const info = await serial.detectedObnizOSVersion();
      spinner.succeed(
        `Configure: Detect Target obnizOS. version=${chalk.green(info.version)} ${chalk.green(info.obnizid)}`,
      );

      if (semver.satisfies(info.version, ">=3.5.0")) {
        // menu mode and json flashing enabled device.
        if (userconf.networks) {
          throw new Error(`You can't use older version of network configration json file.`);
        }
        await serial.setAllFromMenu(userconf);
      } else {
        // virtual UI.
        const networks = userconf.networks;
        if (!networks) {
          throw new Error(`please provide "networks". see more detail at example json file`);
        }
        if (!Array.isArray(networks)) {
          throw new Error(`"networks" must be an array`);
        }
        if (networks.length !== 1) {
          throw new Error(`"networks" must have single object in array.`);
        }
        const network = networks[0];
        const type = network.type;
        const settings = network.settings;
        await serial.setNetworkType(type);
        if (type === "wifi") {
          await serial.setWiFi(settings);
        } else {
          spinner.fail(`Configure: Not Supported Network Type ${type}`);
          throw new Error(`obniz-cli not supporting settings for ${type} right now. wait for future release`);
        }
      }
    }
    await serial.close();
  } catch (e) {
    console.log(received);
    spinner.fail(`Configure: Failed ${e}`);
    throw e;
  }

  spinner.succeed(`Configure: Success`);
};

function nextSpinner(spinner: Ora, text: string, debugserial: any) {
  spinner.succeed();
  spinner = ora(text).start();
  if (debugserial) {
    spinner.stop();
  }
  return spinner;
}
