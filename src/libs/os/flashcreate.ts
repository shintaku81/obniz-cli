import Defaults from "../../defaults";
import OS from "../../libs/obnizio/os";
import Configure from "../../libs/os/configure";
import Device from "../obnizio/device";
import SerialGuess from "../os/serialport_guess";
import * as Storage from "../storage";
import Flash from "./_flash";

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

[flashing setting]
 -h --hardware    hardware to be flashed. default to ${Defaults.HARDWARE}
 -v --version     obnizOS version to be flashed. default to latest one.

[obnizCloud device setting]
 -r --region      device config region
 -d --description device config description
  `,
  async execute(args: any) {
    // login check
    const token = Storage.get("token");
    if (!token) {
      throw new Error(`You must singin before create device`);
    }

    // flashing os
    const obj: any = await preparePort(args);
    const region: any = args.r || args.region || "jp";
    const description: any = args.d || args.description || "";
    const hardware: any = args.h || args.hardware || Defaults.HARDWARE;
    let version: any = args.v || args.version;
    if (!version) {
      version = await OS.latestPublic(hardware);
      console.log(`${version} is the latest for ${hardware}. going to use it.`);
    }
    obj.version = version;
    obj.hardware = hardware;

    obj.stdout = (text: string) => {
      console.log(text);
    };
    await Flash(obj);

    // registrate
    const device = await Device.create(token, {
      region,
      description,
      hardware,
    });
    console.log(`
***
created one device on obniz Cloud.
  obnizID: ${device.id}
  region: ${device.region}
  description: ${device.description}

obniz-cli going to flash Devicekey to connected device.
***
    `);

    obj.configs = obj.configs || {};
    obj.configs.devicekey = device.devicekey;
    if (obj.configs) {
      await Configure(obj);
    }
    console.log(`
Finished Device  ${device.id}
    `);
  },
};
