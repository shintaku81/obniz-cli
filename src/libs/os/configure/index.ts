import chalk from "chalk";
import Serial from "../serial";
import WiFi from "../wifi";

export default async (obj: { portname: string; stdout: any; configs: any; via: string }) => {
  // Return if no configs required
  if (!obj.configs) {
    return;
  }
  // Open a port
  const serial = new Serial({
    portname: obj.portname,
    stdout: obj.stdout,
    onerror: (err) => {
      throw new Error(`${err}`);
    },
  });
  await serial.open();

  // config devicekey
  if (obj.configs.devicekey) {
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
    if (obj.via === "serial") {
      await serial.setNetworkType(type);
      if (type === "wifi") {
        await serial.setWiFi(settings);
      } else {
        console.log(chalk.red(`obniz-cli not supporting settings for ${type} right now. wait for future release`));
      }
    } else {
      // close serial
      await serial.close();
      // Init wifi
      const wifi = new WiFi({
        stdout: obj.stdout,
        onerror: (err) => {
          throw new Error(`${err}`);
        },
      });
      if (type === "wifi") {
        await wifi.setWiFi(settings);
      } else {
        console.log(chalk.red(`obniz-cli not supporting settings for ${type} right now. wait for future release`));
      }
    }
  }
  await serial.close();
};
