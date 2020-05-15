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
 -p --port      serial port path to flash. If not specified. will be automatically selected.
 -b --baud      flashing baud rate. default to ${Defaults.BAUD}

[flashing setting]
 -h --hardware  hardware to be flashed. default to ${Defaults.HARDWARE}
 -v --version   obnizOS version to be flashed. default to latest one.

[configrations]
 -d --devicekey devicekey to be configured after flash. please quote it like "00000000&abcdefghijklkm"
 -i --id        obnizID to be configured. You need to signin before use this.
  `,
  async execute(args: any) {
    // flashing os
    const obj: any = await preparePort(args);
    let hardware: any = args.h || args.hardware;
    if (!hardware) {
      hardware = Defaults.HARDWARE;
    }
    obj.hardware = hardware;
    let version: any = args.v || args.version;
    if (!version) {
      version = await OS.latestPublic(hardware);
      console.log(`${version} is the latest for ${hardware}. going to use it.`);
    }
    obj.version = version;
    // Need something configration after flashing
    const devicekey: any = args.d || args.devicekey;
    if (devicekey) {
      obj.configs = obj.configs || {};
      obj.configs.devicekey = devicekey;
    }
    const obniz_id: any = args.i || args.id;
    if (obniz_id) {
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
      console.log(`
***
device ${obniz_id}
  description: ${device.description}
  createdAt: ${device.createdAt}
  hardware: ${device.hardware}
  status: ${device.status}
  devicekey: ${device.devicekey}
***
      `);
      if (!device.devicekey) {
        throw new Error(`device ${obniz_id} has no devicekey.`);
      }
      obj.configs = obj.configs || {};
      obj.configs.devicekey = device.devicekey;
    }
    obj.stdout = (text: string) => {
      console.log(text);
    };
    await Flash(obj);
    if (obj.configs) {
      const generated_obniz_id = await Configure(obj);
      console.log(`*** configured device.\n obniz_id = ${obniz_id || generated_obniz_id}`);
    }
  },
};
