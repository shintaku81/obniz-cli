import { DefaultParams } from "../../defaults.js";
import { SerialGuess } from "../../libs/os/serial/guess.js";

import chalk from "chalk";
import inquirer from "inquirer";
import { serial } from "@9wick/node-web-serial-ponyfill";
import { SerialPortSelect } from "../../types.js";
import { getLogger } from "../../libs/logger/index.js";
import { PortArgs } from "../parameters.js";
import { getDefaultStorage } from "../../libs/storage.js";

export const PrepareToken = async (input: {
  token?: string;
}): Promise<string> => {
  const token = input.token || getDefaultStorage().get("token");
  if (token) {
    throw new Error("Token is required");
  }
  return token;
};
