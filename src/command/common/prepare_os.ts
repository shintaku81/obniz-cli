import { DefaultParams } from "../../defaults.js";
import { SerialGuess } from "../../libs/os/serial/guess.js";

import chalk from "chalk";
import inquirer from "inquirer";
import { serial } from "@9wick/node-web-serial-ponyfill";
import { ObnizOsSelect, SerialPortSelect } from "../../types.js";
import { getLogger } from "../../libs/logger/index.js";
import OS from "../../libs/obnizio/os.js";
import { FlashObnizOsArgs } from "../parameters.js";

export const PrepareOs = async (
  input: FlashObnizOsArgs,
): Promise<ObnizOsSelect> => {
  const logger = getLogger();
  const hardwareInput = input.h || input.hardware;
  const versionInput = input.v || input.version;
  if (!hardwareInput) {
    logger.log(
      `no input of hardware. Using default hardware=${chalk.green(DefaultParams.HARDWARE)}`,
    );
  }
  const hardware = hardwareInput || DefaultParams.HARDWARE;

  if (!versionInput) {
    logger.log(
      `no input of version. Connecting obnizCloud to Public Latest Version of hardware=hardware=${chalk.green(hardware)}`,
    );
  }
  const version = versionInput || (await OS.latestPublic(hardware));

  logger.log(
    `obnizOS: decided hardware=${chalk.green(hardware)} version=${chalk.green(version)}`,
  );

  return {
    hardware,
    version,
  };
};
