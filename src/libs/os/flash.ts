

import Configure from "../../libs/os/configure";
import OS from '../../libs/obnizio/os'
import Defaults from '../../defaults'
import Flash from './_flash'
import SerialGuess from "../os/serialport_guess";

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
 -k --devicekey devicekey to be configured after flash. please quote it like "00000000&abcdefghijklkm"
  `,
  async execute(args: any) {
    // flashing os
    const obj: any = await preparePort(args);
    let hardware: any = args.h || args.hardware;
    if (!hardware) {
      hardware = Defaults.HARDWARE;
    }
    let version: any = args.v || args.version;
    if (!version) {
      version = await OS.latestPublic(hardware);
      console.log(`${version} is the latest for ${hardware}. going to use it.`)
    }
    obj.version = version;
    obj.hardware = hardware;
    obj.stdout = (text: string) => {
      console.log(text);
    };
    await Flash(obj);
    // Need something configration after flashing
    const devicekey: any = args.k || args.devicekey;
    if (devicekey) {
      obj.configs = obj.configs || {};
      obj.configs.devicekey = devicekey;
    }
    if (obj.configs) {
      const obniz_id = await Configure(obj);
      console.log(`*** configured device.\n obniz_id = ${obniz_id}`);
    }
  },
}