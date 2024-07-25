import { DefaultParams } from "../../defaults.js";
import { SerialGuess } from "../../libs/os/serial/guess.js";

import chalk from "chalk";
import inquirer from "inquirer";
import { serial } from "@9wick/node-web-serial-ponyfill";
import { ObnizOsSelect, SerialPortSelect } from "../../types.js";
import { getLogger } from "../../libs/logger/index.js";
import OS from "../../libs/obnizio/os.js";

export const PrepareOs = async (
  os: Partial<ObnizOsSelect>,
): Promise<ObnizOsSelect> => {
  const logger = getLogger();

  if (!os.hardware) {
    logger.log(
      `no input of hardware. Using default hardware=${chalk.green(DefaultParams.HARDWARE)}`,
    );
  }
  const hardware = os.hardware || DefaultParams.HARDWARE;

  if (!os.version) {
    logger.log(
      `no input of version. Connecting obnizCloud to Public Latest Version of hardware=hardware=${chalk.green(hardware)}`,
    );
  }
  const version = os.version || (await OS.latestPublic(hardware));

  logger.log(
    `obnizOS: decided hardware=${chalk.green(hardware)} version=${chalk.green(version)}`,
  );

  return {
    hardware,
    version,
  };
};
