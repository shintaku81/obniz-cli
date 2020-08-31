import chalk from "chalk";
import Defaults from "../../defaults";
import OS from "../../libs/obnizio/os";
import Device from "../obnizio/device";
import * as Storage from "../storage";
import Flash from "./_flash";
import Config from "./config";
import PreparePort from "./serial/prepare";

export default {
  help: `Flash obnizOS and configure it

[serial setting]
 -p --port        serial port path to flash.If not specified, the port list will be displayed.
 -b --baud        flashing baud rate. default to ${Defaults.BAUD}

[flashing setting]
 -h --hardware    hardware to be flashed. default to ${Defaults.HARDWARE}
 -v --version     obnizOS version to be flashed. default to latest one.

[obnizCloud device setting]
 -r --region      device config region
    --description device config description
 -c --config      configuration file path. If specified obniz-cli proceed settings following file like setting wifi SSID/Password.
  `,
  async execute(args: any) {
    // If device related configration exist
    // It is not allowed. because device will be created from me.
    if (args.d || args.devicekey || args.i || args.id) {
      throw new Error(`You can't pass devicekey/id arguments. Because flash-create will create new device.`);
    }

    // login check
    const token = Storage.get("token");
    if (!token) {
      throw new Error(`You must singin before create device`);
    }

    // SerialPortSetting
    const obj: any = await PreparePort(args);
    obj.stdout = (text: string) => {
      process.stdout.write(text);
    };

    // OS Setting
    const hardware: any = args.h || args.hardware || Defaults.HARDWARE;
    let version: any = args.v || args.version;
    if (!version) {
      version = await OS.latestPublic(hardware);
      console.log(`${version} is the latest for ${hardware}. going to use it.`);
    }
    obj.version = version;
    obj.hardware = hardware;
    await Flash(obj);

    const recoveryDeviceString = Storage.get("recovery-device");
    let device;
    if (recoveryDeviceString) {
      device = JSON.parse(recoveryDeviceString);
      const use = await askUseRecovery(device);
      if (!use) {
        Storage.set("recovery-device", null);
      }
    }

    if (!device) {
      // Device Creation Setting
      const region: any = args.r || args.region || "jp";
      const description: any = args.description || "";
      // registrate
      device = await Device.create(token, {
        region,
        description,
        hardware,
      });
      console.log(
        chalk.green(`
***
created one device on obniz Cloud.
obnizID: ${device.id}
region: ${device.region}
description: ${device.description}

obniz-cli going to flash Devicekey to connected device.
***
      `),
      );
    }

    try {
      // Configure it
      args.p = undefined;
      args.port = obj.portname; // 万が一この期間にシリアルポートが新たに追加されるとずれる可能性があるので
      args.devicekey = device.devicekey;
      await Config.execute(args);
    } catch (e) {
      Storage.set("recovery-device", JSON.stringify(device));
      throw e;
    }
    Storage.set("recovery-device", null);
  },
};

function askUseRecovery(device) {
  return new Promise((resolve, reject) => {
    console.log(
      chalk.yellow(
        `Would you like to use recovery device ${device.id} [ ${device.description} ] rather than create one more device?\nThat is flashing failed one last time.\nIf you choose 'n' saved recovery data will be discarded.`,
      ),
    );

    const readline = require("readline");
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question("Use Recovery? (y or n)", (answer) => {
      if (answer === "y") {
        resolve(true);
      } else if (answer === "n") {
        resolve(false);
      } else {
        reject(new Error(`Enter y or n`));
      }
    });
  });
}
