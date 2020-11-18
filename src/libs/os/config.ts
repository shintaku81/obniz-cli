import chalk from "chalk";
import fs from "fs";
import path from "path";
import Defaults from "../../defaults";
import Device from "../obnizio/device";
import * as Storage from "../storage";
import Config from "./configure";
import PreparePort from "./serial/prepare";

import ora from 'ora';

export default {
  help: `Flash obnizOS and configure it

[serial setting]
 -p --port        serial port path to flash.If not specified, the port list will be displayed.
 -b --baud        flashing baud rate. default to ${Defaults.BAUD}

 [configrations]
 -d --devicekey   devicekey to be configured after flash. please quote it like "00000000&abcdefghijklkm"
 -i --id          obnizID to be configured. You need to signin before use this.
 -c --config      configuration file path. If specified obniz-cli proceed settings following file like setting wifi SSID/Password.
  `,
  async execute(args: any) {
    // Serial Port Setting
    let received = "";
    const obj = await PreparePort(args);
    obj.stdout = (text: string) => {
      // process.stdout.write(text);
      received += text;
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
      const spinner = ora(`Configure: Opening Serial Port ${chalk.green(obj.portname)}`).start();
      try {
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
        if (!device.devicekey) {
          throw new Error(`device ${obniz_id} has no devicekey.`);
        }
        obj.configs = obj.configs || {};
        obj.configs.devicekey = device.devicekey;
        spinner.succeed(`Configure: obnizID=${obniz_id} hardware=${device.hardware} devicekey=${device.devicekey}`)
      } catch(e)  {
        spinner.fail(`Configure: Failed ${e}`);
        throw e
      }
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
    }

    //
    if (!obj.configs) {
      // no configration provided
      console.log(`No configration found. exit.`);
      return;
    }

    await Config(obj);
  },
};
