import chalk from "chalk";
import { DefaultParams } from "../../defaults.js";
import OS from "../../libs/obnizio/os.js";
import { flash } from "../../libs/os/flash.js";
import { validate as validateConfig } from "../../libs/os/config.js";
import { PreparePort } from "../common/prepare_port.js";

import { getOra } from "../../libs/ora-console/getora.js";
import { ConfigCommand } from "./config.js";
import { Command } from "../arg.js";
import { PrepareOs } from "../common/prepare_os.js";
import {
  FlashConfigArgs,
  FlashObnizIdArgs,
  FlashObnizOsArgs,
  PortArgs,
} from "../parameters.js";
const ora = getOra();

export type FlashCommandArgs = PortArgs &
  FlashObnizOsArgs &
  FlashObnizIdArgs &
  FlashConfigArgs;

export const FlashCommand = {
  help: `Flash obnizOS and configure it

[serial setting]
 -p --port      serial port path to flash.If not specified, the port list will be displayed.
 -b --baud      flashing baud rate. default to ${DefaultParams.BAUD}

[flashing setting]
 -h --hardware  hardware to be flashed. default to ${DefaultParams.HARDWARE}
 -v --version   obnizOS version to be flashed. default to latest one.

[configurations]
 -d --devicekey devicekey to be configured after flash. please quote it like "00000000&abcdefghijklkm"
 -i --id        obnizID to be configured. You need to signin before use this or set --token param.
 -c --config    configuration file path. If specified obniz-cli proceed settings following file like setting wifi SSID/Password.
    --token     Token of api key which use instead of user signin.

[operation]
    --operation     operation name for setting.
    --indication    indication name for setting.
      `,
  async execute(args: FlashCommandArgs) {
    // validate first
    await validateConfig(args);

    // flashing os
    const baudStr = args.b || args.baud;
    const port = await PreparePort({
      portname: args.p || args.port,
      baud: baudStr ? parseInt(baudStr) : undefined,
    });
    const os = await PrepareOs({
      hardware: args.h || args.hardware,
      version: args.v || args.version,
    });

    await flash(port, os);
    // Configure it
    args.p = undefined;
    args.port = port.portname; // 万が一この期間にシリアルポートが新たに追加されるとずれる可能性があるので
    await ConfigCommand.execute(args);
  },
} as const satisfies Command;
