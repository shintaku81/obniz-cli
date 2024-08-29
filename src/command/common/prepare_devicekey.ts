import { FlashObnizIdArgs } from "../parameters.js";
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
