import chalk from "chalk";
import Defaults from "../../defaults";
import OS from "../../libs/obnizio/os";
import Flash from "./_flash";
import Config from "./config";
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
 -p --port      serial port path to flash. If not specified. will be automatically selected.
 -b --baud      flashing baud rate. default to ${Defaults.BAUD}

[flashing setting]
 -h --hardware  hardware to be flashed. default to ${Defaults.HARDWARE}
 -v --version   obnizOS version to be flashed. default to latest one.

[configrations]
 -d --devicekey devicekey to be configured after flash. please quote it like "00000000&abcdefghijklkm"
 -i --id        obnizID to be configured. You need to signin before use this.
 -c --config    configuration file path. If specified obniz-cli proceed settings following file like setting wifi SSID/Password.
  `,
  async execute(args: any) {
    // flashing os
    const obj: any = await preparePort(args);
    obj.stdout = (text) => {
      process.stdout.write(text);
    };

    // OS setting
    let hardware: any = args.h || args.hardware;
    if (!hardware) {
      hardware = Defaults.HARDWARE;
    }
    obj.hardware = hardware;
    let version: any = args.v || args.version;
    if (!version) {
      version = await OS.latestPublic(hardware);
      console.log(chalk.yellow(`${version} is the latest for ${hardware}. going to use it.`));
    }
    obj.version = version;
    await Flash(obj);

    // Configure it
    args.p = undefined;
    args.port = obj.portname; // 万が一この期間にシリアルポートが新たに追加されるとずれる可能性があるので
    await Config.execute(args);
  },
};
