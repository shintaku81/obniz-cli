import chalk from "chalk";
import Serial from "../serial";
import WiFi from "../wifi";

import ora from "ora";

export default async (obj: { portname: string; debugserial:any, stdout: any; configs: any; via: string }) => {
  // Return if no configs required
  if (!obj.configs) {
    return;
  }

  let serial;
  let received = "";
  const spinner = ora(`Configure: Opening Serial Port ${chalk.green(obj.portname)}`).start();
  if (obj.debugserial) {
    spinner.stop();
  }
  try {
      // Open a port
    serial = new Serial({
      portname: obj.portname,
      stdout: (text) => {
        if (obj.debugserial) {
          console.log(text)
        }
        received += text;
        obj.stdout(text);
      },
      onerror: (err) => {
        received += err;
        console.log(serial.totalReceived);
        throw new Error(`${err}`);
      },
      progress: (text) => {
        spinner.text = text;
      }
    });
    await serial.open();

    // config devicekey
    if (obj.configs.devicekey) {
      spinner.text = `Configure: Wiring DeviceKey...`
      await serial.setDeviceKey(obj.configs.devicekey);
    }

    // config network
    if (obj.configs.config) {
      const userconf = obj.configs.config;
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
      spinner.text = `Configure: Setting Network Type...`
      await serial.setNetworkType(type);
      if (type === "wifi") {
        spinner.text = `Configure: Setting Wi-Fi configration`
        await serial.setWiFi(settings);
      } else {
        spinner.fail(`Configure: Not Supported Network Type ${type}`);
        throw new Error(`obniz-cli not supporting settings for ${type} right now. wait for future release`);
      }
    }
    await serial.close();
  } catch(e) {
    console.log(received);
    spinner.fail(`Configure: Failed ${e}`);
    throw e;
  }

  spinner.succeed(`Configure: Success`);
};
