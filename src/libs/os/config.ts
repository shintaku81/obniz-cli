import chalk from "chalk";
import fs from "fs";
import path from "path";
import Defaults from "../../defaults";
import Device from "../obnizio/device";
import * as Storage from "../storage";
import Config from "./configure";
import SerialGuess from "./serial/guess";

async function preparePort(args: any): Promise<any> {
  let portname: string = args.p || args.port;
  if (!portname) {
    portname = await SerialGuess();
    if (portname) {
      console.log(`Guessed Serial Port ${portname}`);
    }
  }
  let baud: any = args.b || args.baud;
  if (!baud) {
    baud = Defaults.BAUD;
  }
  if (!portname) {
    console.log(`No port defined. And auto detect failed`);
    process.exit(0);
  }
  return {
    portname,
    baud,
  };
}

export default {
  help: `Flash obnizOS and configure it

[serial setting]
 -p --port        serial port path to flash. If not specified. will be automatically selected.
 -b --baud        flashing baud rate. default to ${Defaults.BAUD}

 [configrations]
 -d --devicekey   devicekey to be configured after flash. please quote it like "00000000&abcdefghijklkm"
 -i --id          obnizID to be configured. You need to signin before use this.
 -c --config      configuration file path. If specified obniz-cli proceed settings following file like setting wifi SSID/Password.
 -v --via         serial(physically connected) or wifi. default is set to serial.
  `,
  async execute(args: any) {
    // Serial Port Setting
    const obj = await preparePort(args);
    obj.stdout = (text: string) => {
      process.stdout.write(text);
    };

    // DeviceKey Setting
    const devicekey: any = args.d || args.devicekey;
    let obniz_id: any = null;
    if (devicekey) {
      obj.configs = obj.configs || {};
      obj.configs.devicekey = devicekey;
      obniz_id = devicekey.split("&")[0];
    }
    if (args.i || args.id) {
      obniz_id = args.i || args.id;
      if (obj.configs && obj.configs.devicekey) {
        throw new Error(`devicekey and id are double specified.`);
      }
      const token = Storage.get("token");
      if (!token) {
        throw new Error(`You need to signin first to use obniz Cloud from obniz-cli.`);
      }
      const device = await Device.get(token, obniz_id);
      if (!device) {
        throw new Error(`device ${obniz_id} was not found in your devices.`);
      }
      console.log(
        chalk.green(`
***
device ${obniz_id}
  description: ${device.description}
  createdAt: ${device.createdAt}
  hardware: ${device.hardware}
  status: ${device.status}
  devicekey: ${device.devicekey}
***
      `),
      );
      if (!device.devicekey) {
        throw new Error(`device ${obniz_id} has no devicekey.`);
      }
      obj.configs = obj.configs || {};
      obj.configs.devicekey = device.devicekey;
    }

    // Network Setting
    const configPath: any = args.c || args.config;
    if (configPath) {
      const filepath = path.isAbsolute(configPath) ? configPath : path.join(process.cwd(), configPath);
      if (!fs.existsSync(filepath)) {
        throw new Error(`config file ${filepath} does not exist!!`);
      }
      const jsonString = fs.readFileSync(filepath, { encoding: "utf8" });
      let json: any = null;
      try {
        json = JSON.parse(jsonString);
      } catch (e) {
        console.error(`Can't read config file as json`);
        throw e;
      }
      obj.configs = obj.configs || {};
      obj.configs.config = json;
      obj.via = args.v || args.via || "serial";
      if (obj.via !== "serial" && obj.via !== "wifi") {
        console.log(`--via option must be specified with "serial" or "wifi".`);
        return;
      }
    }

    //
    if (!obj.configs) {
      // no configration provided
      console.log(`No configration found. exit.`);
      return;
    }

    await Config(obj);
    console.log(
      chalk.green(`
***
configured device.
***
`),
    );
  },
};
