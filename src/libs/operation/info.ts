import chalk from "chalk";
import fs from "fs";
import ora from "ora";
import path from "path";
import Defaults from "../../defaults";
import Device from "../obnizio/device";
import Config from "../os/configure";
import PreparePort from "../os/serial/prepare";
import * as Storage from "../storage";

export default {
  help: `Show the operation info
  `,
  async execute(args: any) {
    console.log("operation info");
  },
};
