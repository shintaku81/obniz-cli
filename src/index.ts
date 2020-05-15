#!/usr/bin/env node

import Args from "./arg";
import * as gui from "./gui";
import Ports from "./ports";

import Configure from "./libs/os/configure";
import Erase from "./libs/os/erase";
import Flash from "./libs/os/flash";
import List from "./libs/os/list";
import SerialGuess from "./libs/os/serialport_guess";

import Login from './libs/user/login'
import Logout from './libs/user/logout'
import UserInfo from './libs/user/info'

const DEFAULT_BAUD = 1500000;
const DEFAULT_HARDWARE = "esp32w";
const DEFAULT_VERSION = "3.2.0";

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
    baud = DEFAULT_BAUD;
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
    async execute(args: any) {
      await Login();
    },
  },
  "signout": {
    async execute(args: any) {
      await Logout();
    },
  },
  "user:info": {
    async execute(args: any) {
      await UserInfo();
    },
  },
  "os:create": {
    async execute(args: any) {
      const obj = await preparePort(args);
      obj.stdout = (text: string) => {
        console.log(text);
      };
    },
  },
  "os:flash": {
    async execute(args: any) {
      // flashing os
      const obj: any = await preparePort(args);
      let version: any = args.v || args.version;
      if (!version) {
        version = DEFAULT_VERSION;
      }
      let hardware: any = args.h || args.hardware;
      if (!hardware) {
        hardware = DEFAULT_HARDWARE;
      }
      obj.version = version;
      obj.hardware = hardware;
      obj.stdout = (text: string) => {
        console.log(text);
      };
      await Flash(obj);
      // Need something configration after flashing
      const devicekey: any = args.k || args.devicekey;
      if (devicekey) {
        obj.configs = obj.configs || {};
        obj.configs.devicekey = devicekey;
      }
      if (obj.configs) {
        const obniz_id = await Configure(obj);
        console.log(`*** configured device.\n obniz_id = ${obniz_id}`);
      }
    },
  },
  "os:erase": {
    async execute(args: any) {
      const obj = await preparePort(args);
      (obj.stdout = (text: string) => {
        console.log(text);
      }),
        await Erase(obj);
    },
  },
  "os:ports": {
    async execute(args: any) {
      await Ports();
    },
  },
  "os:list": {
    async execute(args: any) {
      let hardware: any = args.h || args.hardware;
      if (!hardware) {
        hardware = DEFAULT_HARDWARE;
      }
      await List(hardware);
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
    console.log(`CLI to interact with obniz

VERSION
  obniz-cli/${packageverion}

USAGE
  $ obniz-cli [COMMAND]

COMMANDS

  gui         Launch GUI mode of obniz-cli

  signin      Signin to obniz cloud.
  signout     Signout
  user:info   Show current Logged in user

  os:create   Flashing and configure target device and registrate it on your account on obnizCloud.
               ARGS: -h XXX -v X.X.X -p XXX -b XXX -config XXXX -continue yes
  os:flash    Flashing and configure target device.
               ARGS: -h XXX -v X.X.X -p XXX -b XXX -k XXXX -config XXXX -continue yes
  os:erase    Fully erase a flash on target device.
               ARGS: -p XXX
  os:terminal Simply Launch terminal
               ARGS: -p XXX
  os:list     List of available obnizOS for specified hardware
               ARGS: -h XXX
  os:ports    Getting serial ports on your machine.
  `);
  },
};

Args(routes)
  .then(() => {})
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
