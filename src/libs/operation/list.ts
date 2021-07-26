import chalk from "chalk";
import fs from "fs";
import ora from "ora";
import path from "path";
import Defaults from "../../defaults";
import Device from "../obnizio/device";
import User from "../obnizio/user";
import Config from "../os/configure";
import PreparePort from "../os/serial/prepare";
import * as Storage from "../storage";
import {Operation} from "./modules/operation";

export default {
  help: `Show your operation list
  `,
  async execute(args: any) {
    const token = Storage.get("token");
    if (!token) {
      console.log(`Not Sign In`);
      return;
    }

    console.log(`Contacting to obniz Cloud...`);

    const operations = await Operation.getList(token);
    console.log(operations.length);
  },
};
