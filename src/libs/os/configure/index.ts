import chalk from "chalk";
import Serial from "../serial";

export default async (obj: { portname: string; stdout: any; configs: any }) => {
  // Return if no configs required
  if (!obj.configs) {
    return;
  }

  // Open aport
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
    await serial.setNetworkType(type);
    if (type === "wifi") {
      await serial.setWiFi(settings);
    } else {
      console.log(chalk.red(`obniz-cli not supporting settings for ${type} right now. wait for future release`));
    }
  }

  // close serial
  await serial.close();
};
