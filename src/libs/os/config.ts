import Defaults from "../../defaults";
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
 -d --devicekey devicekey to be configured after flash. please quote it like "00000000&abcdefghijklkm"
  `,
  async execute(args: any) {
    const obj = await preparePort(args);
    obj.stdout = (text: string) => {
      process.stdout.write(text);
    };
    const devicekey: any = args.d || args.devicekey;
    if (devicekey) {
      obj.configs = obj.configs || {};
      obj.configs.devicekey = devicekey;
    }
    await Config(obj);
  },
};
