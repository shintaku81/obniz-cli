#!/usr/bin/env node
import wtf from "wtfnode";

import chalk from "chalk";

import Args from "./arg";
import Ports from "./libs/os/ports";

import { ConfigCommand } from "./command/os/config";
import ConfigViaWiFi from "./libs/os/config_via_wifi";
import Erase from "./libs/os/erase";
import { FlashCommand } from "./command/os/flash";
import { FlashCreateCommand } from "./command/os/flashcreate";
import List from "./libs/os/list";
import PreparePort from "./libs/os/serial/prepare";

import { UserInfoCommand } from "./command/user/info";
import { LoginCommand } from "./command/user/login";
import { LogoutCommand } from "./command/user/logout";

import OperationInfo from "./libs/operation/info";
import OperationList from "./libs/operation/list";

const packageverion = require(`../package.json`).version;

// ========== Global Errors =========

process.on("uncaughtException", err => {
  console.error(err);
  throw err;
});

process.on("unhandledRejection", err => {
  console.error(err);
  throw err;
});

// ========== Routes =========
const routes = {
  signin: {
    help: `Signin to obniz Cloud`,
    async execute(args: any) {
      await LoginCommand();
    }
  },
  signout: {
    help: `Signout`,
    async execute(args: any) {
      await LogoutCommand();
    }
  },
  "user:info": {
    help: `Get Currently signin user's information from cloud`,
    async execute(args: any) {
      await UserInfoCommand();
    }
  },
  "os:flash-create": FlashCreateCommand,
  "os:flash": FlashCommand,
  "os:config": ConfigCommand,
  "os:config-via-wifi": ConfigViaWiFi,
  "os:erase": {
    async execute(args: any) {
      const obj = await PreparePort(args);
      obj.stdout = (text: string) => {
        process.stdout.write(text);
      };
      await Erase(obj);
    }
  },
  "os:list": List,
  "os:ports": {
    help: `List your machine's serial ports`,
    async execute(args: any) {
      await Ports();
    }
  },
  "operation:list": OperationList,
  "operation:info": OperationInfo,
  help: async () => {
    console.log(`
       _           _               _ _
  ___ | |__  _ __ (_)____      ___| (_)
 / _ \\| '_ \\| '_ \\| |_  /____ / __| | |
| (_) | |_) | | | | |/ /_____| (__| | |
 \\___/|_.__/|_| |_|_/___|     \\___|_|_|


CLI to interact with obniz device and cloud.

VERSION
  obniz-cli/${packageverion}

USAGE
  $ obniz-cli [COMMAND]

COMMANDS

  signin              Signin to obniz cloud.
  signout             Signout

  user:info           Show current Logged in user

  os:flash-create     Flashing and configure target device and registrate it on your account on obnizCloud.
  os:flash            Flashing and configure target device.
  os:config           Configure obnizOS flashed device.
  os:config-via-wifi  Configure ObnizOS network via Wi-Fi from devices.
  os:erase            Fully erase a flash on target device.
  os:list             List of available obnizOS hardwares and versions
  os:ports            Getting serial ports on your machine.

  operation:list      List of available operations.
  operation:info      Show operation info.
  `);
  }
};

Args(routes)
  .then(() => {
    // wtf.dump();
  })
  .catch(e => {
    console.log(chalk.red(`${e}`));
    process.exit(1);
  });
