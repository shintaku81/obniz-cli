import { DefaultParams } from "../../defaults.js";
import { PreparePort } from "../common/prepare_port.js";
import Config from "../../libs/os/configure/index.js";
import { validate } from "../../libs/os/config.js";
import { Command } from "../arg.js";
import { getDefaultStorage } from "../../libs/storage.js";

export interface ConfigCommandArgs {
  p?: string;
  port?: string;
  b?: string;
  baud?: string;
  d?: string;
  devicekey?: string;
  i?: string;
  id?: string;
  c?: string;
  config?: string;
  token?: string;
  operation?: string;
  indication?: string;
}

export const ConfigCommand = {
  help: `Flash obnizOS and configure it

[serial setting]
 -p --port        serial port path to flash.If not specified, the port list will be displayed.
 -b --baud        flashing baud rate. default to ${DefaultParams.BAUD}

 [configurations]
 -d --devicekey     devicekey to be configured after flash. please quote it like "00000000&abcdefghijklkm"
 -i --id            obnizID to be configured. You need to signin before use this or set --token param.
 -c --config        configuration file path. If specified obniz-cli proceed settings following file like setting wifi SSID/Password.
    --token         Token of api key which use instead of user signin.

 [operation]
    --operation     operation name for setting.
    --indication    indication name for setting.
  `,
  async execute(args: ConfigCommandArgs) {
    // check input first
    await validate(args);

    // Serial Port Setting
    let received = "";
    const baudStr = args.b || args.baud;
    const port = await PreparePort({
      portname: args.p || args.port,
      baud: baudStr ? parseInt(baudStr) : undefined,
    });
    const token = args.token || getDefaultStorage().get("token");

    const config: any = {
      token,
      portname: port.portname,
      stdout: (text: string) => {
        // process.stdout.write(text);
        received += text;
      },
    };
    // set params to obj
    await validate(args, config, true);

    if (!config.configs) {
      // no configuration provided
      console.log(`No configuration found. Finished.`);
      return;
    }

    await Config(config);
  },
} as const satisfies Command;
