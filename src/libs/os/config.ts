import chalk from "chalk";
import fs from "fs";
import path from "path";
import Defaults from "../../defaults";
import Device from "../obnizio/device";
import { Operation } from "../obnizio/operation";
import * as Storage from "../storage";
import Config from "./configure";
import PreparePort from "./serial/prepare";

import ora from "ora";

export async function deviceConfigValidate(args: Readonly<any>, obj: any = {}, logging = false) {
  const devicekey: any = args.d || args.devicekey;
  let obniz_id: any = null;
  if (devicekey) {
    obj.configs = obj.configs || {};
    obj.configs.devicekey = devicekey;
    obniz_id = devicekey.split("&")[0];
  }
  if (args.i || args.id) {
    const spinner = logging ? ora(`Configure: Opening Serial Port ${chalk.green(obj.portname)}`).start() : null;
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
      spinner?.succeed(`Configure: obnizID=${device.id} hardware=${device.hardware} devicekey=${device.devicekey}`);
    } catch (e) {
      spinner?.fail(`Configure: Failed ${e}`);
      throw e;
    }
  }
}

export async function networkConfigValidate(args: Readonly<any>, obj: any = {}, logging = false) {
  // Network Setting
  const configPath: string | null = args.c || args.config || null;
  const operationName: string | null = args.op || args.operation || null;
  const indicationName: string | null = args.ind || args.indication || null;
  if ((operationName && !indicationName) || (!operationName && indicationName)) {
    throw new Error("If you want to use operation, set both param of operation and indication.");
  } else if (configPath && operationName && indicationName) {
    throw new Error("You cannot use configPath and operation same time.");
  } else if (configPath) {
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
  } else if (operationName && indicationName) {
    const token = Storage.get("token");
    if (!token) {
      throw new Error(`You need to signin first to use obniz Cloud from obniz-cli.`);
    }
    await Operation.checkPermission(token);
    const op = await Operation.getByOperationName(token, operationName);
    if(!op){

    }
  }
}

export async function validate(args: Readonly<any>, obj: any = {}, logging = false) {
  await deviceConfigValidate(args, obj, logging);
  await networkConfigValidate(args, obj, logging);
}

export default {
  help: `Flash obnizOS and configure it

[serial setting]
 -p --port        serial port path to flash.If not specified, the port list will be displayed.
 -b --baud        flashing baud rate. default to ${Defaults.BAUD}

 [configrations]
 -d --devicekey     devicekey to be configured after flash. please quote it like "00000000&abcdefghijklkm"
 -i --id            obnizID to be configured. You need to signin before use this.
 -c --config        configuration file path. If specified obniz-cli proceed settings following file like setting wifi SSID/Password.
 -op --operation    operation id of
 -ind --indication
  `,
  async execute(args: any) {
    // check input first
    await validate(args);

    // Serial Port Setting
    let received = "";
    const obj = await PreparePort(args);
    obj.stdout = (text: string) => {
      // process.stdout.write(text);
      received += text;
    };

    // set params to obj
    await validate(args, obj, true);

    if (!obj.configs) {
      // no configuration provided
      console.log(`No configuration found. exit.`);
      return;
    }

    await Config(obj);
  },
};
