import Defaults from "../../defaults.js";
import PreparePort from "../../libs/os/serial/prepare.js";
import * as Storage from "../../libs/storage.js";
import Config from "../../libs/os/configure/index.js";
import { validate } from "../../libs/os/config.js";

export const ConfigCommand = {
  help: `Flash obnizOS and configure it

[serial setting]
 -p --port        serial port path to flash.If not specified, the port list will be displayed.
 -b --baud        flashing baud rate. default to ${Defaults.BAUD}

 [configurations]
 -d --devicekey     devicekey to be configured after flash. please quote it like "00000000&abcdefghijklkm"
 -i --id            obnizID to be configured. You need to signin before use this or set --token param.
 -c --config        configuration file path. If specified obniz-cli proceed settings following file like setting wifi SSID/Password.
    --token         Token of api key which use instead of user signin.

 [operation]
    --operation     operation name for setting.
    --indication    indication name for setting.
  `,
  async execute(args: any, proceed?: (i: number) => void) {
    // check input first
    await validate(args);

    // Serial Port Setting
    let received = "";
    const obj = await PreparePort(args);
    obj.stdout = (text: string) => {
      // process.stdout.write(text);
      received += text;
    };
    obj.token = args.token || Storage.get("token");

    // set params to obj
    await validate(args, obj, true);
    if (proceed) {
      proceed(6);
    }

    if (!obj.configs) {
      // no configuration provided
      console.log(`No configuration found. Finished.`);
      return;
    }

    await Config(obj);
    if (proceed) {
      proceed(7);
    }
  },
};
