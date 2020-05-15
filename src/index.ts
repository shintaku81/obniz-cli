#!/usr/bin/env node

import Args from "./arg";
import * as gui from "./gui";
import Ports from "./ports";

import Erase from "./libs/os/erase";
import Flash from "./libs/os/flash";
import Create from "./libs/os/flashcreate";
import List from "./libs/os/list";
import SerialGuess from "./libs/os/serialport_guess";

import UserInfo from "./libs/user/info";
import Login from "./libs/user/login";
import Logout from "./libs/user/logout";

import Defaults from "./defaults";

const relative = "../";

const packageverion = require(`${relative}package.json`).version;

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

async function preparePort(args: any): Promise<any> {
  let portname: string = args.p || args.port;
  if (!portname) {
    portname = await SerialGuess();
    if (portname) {
      console.log(`Guessed Serial Port ${portname}`);
    }
  }
  let baud: any = args.b || args.baud;
  if (!baud) {
    baud = Defaults.BAUD;
  }
  if (!portname) {
    console.log(`No port defined. And auto detect failed`);
    process.exit(0);
  }
  return {
    portname,
    baud,
  };
}

const routes = {
  "signin": {
    help: `Signin to obniz Cloud`,
    async execute(args: any) {
      await Login();
    },
  },
  "signout": {
    help: `Signout`,
    async execute(args: any) {
      await Logout();
    },
  },
  "user:info": {
    help: `Get Currently signin user's information from cloud`,
    async execute(args: any) {
      await UserInfo();
    },
  },
  "os:flash-create": Create,
  "os:flash": Flash,
  "os:erase": {
    async execute(args: any) {
      const obj = await preparePort(args);
      obj.stdout = (text: string) => {
        console.log(text);
      };
      await Erase(obj);
    },
  },
  "os:list": List,
  "os:ports": {
    help: `List your machine's serial ports`,
    async execute(args: any) {
      await Ports();
    },
  },
  "gui": {
    async execute(args: any) {
      console.log(`Launching...`);
      try {
        await gui.start();
      } catch (e) {
        console.error(`Failed to Launch GUI`);
        console.error(e);
        process.exit(1);
      }
    },
  },
  "help": async () => {
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

  signin            Signin to obniz cloud.
  signout           Signout

  user:info         Show current Logged in user

  os:flash-create   Flashing and configure target device and registrate it on your account on obnizCloud.
  os:flash          Flashing and configure target device.
  os:erase          Fully erase a flash on target device.
  os:list           List of available obnizOS for specified hardware
  os:ports          Getting serial ports on your machine.
  `);
  },
};

Args(routes)
  .then(() => {})
  .catch((e) => {
    console.error(`${e}`);
    process.exit(1);
  });
