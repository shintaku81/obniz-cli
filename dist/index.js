#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const arg_1 = __importDefault(require("./arg"));
const gui = __importStar(require("./gui"));
const ports_1 = __importDefault(require("./ports"));
const erase_1 = __importDefault(require("./libs/os/erase"));
const flash_1 = __importDefault(require("./libs/os/flash"));
const flashcreate_1 = __importDefault(require("./libs/os/flashcreate"));
const list_1 = __importDefault(require("./libs/os/list"));
const serialport_guess_1 = __importDefault(require("./libs/os/serialport_guess"));
const info_1 = __importDefault(require("./libs/user/info"));
const login_1 = __importDefault(require("./libs/user/login"));
const logout_1 = __importDefault(require("./libs/user/logout"));
const defaults_1 = __importDefault(require("./defaults"));
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
async function preparePort(args) {
    let portname = args.p || args.port;
    if (!portname) {
        portname = await serialport_guess_1.default();
        if (portname) {
            console.log(`Guessed Serial Port ${portname}`);
        }
    }
    let baud = args.b || args.baud;
    if (!baud) {
        baud = defaults_1.default.BAUD;
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
        async execute(args) {
            await login_1.default();
        },
    },
    "signout": {
        help: `Signout`,
        async execute(args) {
            await logout_1.default();
        },
    },
    "user:info": {
        help: `Get Currently signin user's information from cloud`,
        async execute(args) {
            await info_1.default();
        },
    },
    "os:flash-create": flashcreate_1.default,
    "os:flash": flash_1.default,
    "os:erase": {
        async execute(args) {
            const obj = await preparePort(args);
            obj.stdout = (text) => {
                console.log(text);
            };
            await erase_1.default(obj);
        },
    },
    "os:ports": {
        async execute(args) {
            await ports_1.default();
        },
    },
    "os:list": {
        async execute(args) {
            let hardware = args.h || args.hardware;
            if (!hardware) {
                hardware = defaults_1.default.HARDWARE;
            }
            await list_1.default(hardware);
        },
    },
    "gui": {
        async execute(args) {
            console.log(`Launching...`);
            try {
                await gui.start();
            }
            catch (e) {
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
arg_1.default(routes)
    .then(() => { })
    .catch((e) => {
    console.error(`${e}`);
    process.exit(1);
});
