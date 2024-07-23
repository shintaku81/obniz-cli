#!/usr/bin/env node
import chalk from "chalk";
import { Args, Command } from "./command/arg.js";
import { HelpCommand } from "./command/help.js";
import { OperationInfoCommand } from "./command/operation/info.js";
import { OperationListCommand } from "./command/operation/list.js";
import { ConfigCommand } from "./command/os/config.js";
import { ConfigViaWifiCommand } from "./command/os/config_via_wifi.js";
import { EraseCommand } from "./command/os/erase.js";
import { FlashCommand } from "./command/os/flash.js";
import { FlashCreateCommand } from "./command/os/flashcreate.js";
import { ListCommand } from "./command/os/list.js";
import { PortsCommand } from "./command/os/ports.js";
import { UserInfoCommand } from "./command/user/info.js";
import { LoginCommand } from "./command/user/login.js";
import { LogoutCommand } from "./command/user/logout.js";
import PreparePort from "./libs/os/serial/prepare.js";
import { LogCommand } from "./command/os/log.js";

// ========== Global Errors =========

process.on("uncaughtException", (err) => {
  console.error(err);
  throw err;
});

process.on("unhandledRejection", (err) => {
  console.error(err);
  throw err;
});

// ========== Routes =========
const routes: Record<string, Command> = {
  signin: {
    help: `Signin to obniz Cloud`,
    async execute(args: any) {
      await LoginCommand();
    },
  },
  signout: {
    help: `Signout`,
    async execute(args: any) {
      await LogoutCommand();
    },
  },
  "user:info": {
    help: `Get Currently signin user's information from cloud`,
    async execute(args: any) {
      await UserInfoCommand();
    },
  },
  "os:flash-create": FlashCreateCommand,
  "os:flash": FlashCommand,
  "os:config": ConfigCommand,
  "os:config-via-wifi": ConfigViaWifiCommand,
  "os:erase": {
    help: "Fully erase a flash on target device.",
    async execute(args: any) {
      const obj = await PreparePort(args);
      obj.stdout = (text: string) => {
        process.stdout.write(text);
      };
      await EraseCommand(obj);
    },
  },
  "os:list": ListCommand,
  "os:log": {
    help: "Fully erase a flash on target device.",
    async execute(args: any) {
      const obj = await PreparePort(args);
      obj.stdout = (text: string) => {
        process.stdout.write(text);
      };
      await LogCommand(obj);
    },
  },
  "os:ports": {
    help: `List your machine's serial ports`,
    async execute(args: any) {
      await PortsCommand();
    },
  },
  "operation:list": OperationListCommand,
  "operation:info": OperationInfoCommand,
  help: {
    help: `Show help`,
    async execute() {
      await HelpCommand();
    },
  },
};

Args(routes)
  .then(() => {
    // wtf.dump();
  })
  .catch((e) => {
    console.log(chalk.red(`${e}`));
    process.exit(1);
  })
  .then(() => {
    process.exit(0);
  });
