import { DefaultParams } from "../../defaults.js";
import { SerialGuess } from "../../libs/os/serial/guess.js";

import chalk from "chalk";
import inquirer from "inquirer";
import { serial } from "@9wick/node-web-serial-ponyfill";
import { SerialPortSelect } from "../../types.js";
import { getLogger } from "../../libs/logger/index.js";
import { FlashObnizIdArgs, PortArgs } from "../parameters.js";
import { getDefaultStorage } from "../../libs/storage.js";
import { PrepareToken } from "./prepare_token.js";
import Device from "../../libs/obnizio/device.js";

export const PrepareDevicekey = async (
  input: FlashObnizIdArgs,
): Promise<{ obnizId: string; devicekey: string } | null> => {
  const devicekeyInput = input.d || input.devicekey;
  const obnizIdInput = input.i || input.id || input.obniz_id;

  if (!devicekeyInput && !obnizIdInput) {
    return null;
  }

  if (devicekeyInput) {
    const splited = devicekeyInput.split("&");
    if (splited.length !== 2) {
      throw new Error(`Invalid devicekey format`);
    }
    return {
      obnizId: splited[0],
      devicekey: devicekeyInput,
    };
  }

  if (obnizIdInput) {
    // ログインが必要
    const token = await PrepareToken(input);
    if (!(await Device.checkReadPermission(token))) {
      throw new Error(`Your token is not permitted to be read the device`);
    }
    const device = await Device.get(token, obnizIdInput);
    if (!device) {
      throw new Error(`device ${obnizIdInput} was not found in your devices.`);
    }
    if (!device.devicekey) {
      throw new Error(`device ${obnizIdInput} has no devicekey.`);
    }

    return {
      obnizId: obnizIdInput,
      devicekey: device.devicekey,
    };
  }
  return null;
};
