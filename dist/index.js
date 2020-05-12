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
const configure_1 = __importDefault(require("./libs/configure"));
const erase_1 = __importDefault(require("./libs/erase"));
const flash_1 = __importDefault(require("./libs/flash"));
const serialport_guess_1 = __importDefault(require("./libs/serialport_guess"));
const DEFAULT_BAUD = 1500000;
const DEFAULT_HARDWARE = "esp32w";
const DEFAULT_VERSION = "3.2.0";
let relative = "../";
if (__dirname.indexOf("/dist/") >= 0) {
    relative += "../";
}
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
    "login": {
        async execute(args) { },
    },
    "os:create": {
        async execute(args) {
            const obj = await preparePort(args);
            obj.stdout = (text) => {
                console.log(text);
            };
        },
    },
    "os:flash": {
        async execute(args) {
            // flashing os
            const obj = await preparePort(args);
            let version = args.v || args.version;
            if (!version) {
                version = DEFAULT_VERSION;
            }
            let hardware = args.h || args.hardware;
            if (!hardware) {
                hardware = DEFAULT_HARDWARE;
            }
            obj.version = version;
            obj.hardware = hardware;
            obj.stdout = (text) => {
                console.log(text);
            };
            await flash_1.default(obj);
            // Need something configration after flashing
            const devicekey = args.k || args.devicekey;
            if (devicekey) {
                obj.configs = obj.configs || {};
                obj.configs.devicekey = devicekey;
            }
            if (obj.configs) {
                const obniz_id = await configure_1.default(obj);
                console.log(`*** configured device.\n obniz_id = ${obniz_id}`);
            }
        },
    },
    "os:erase": {
        async execute(args) {
            const obj = await preparePort(args);
            (obj.stdout = (text) => {
                console.log(text);
            }),
                await erase_1.default(obj);
        },
    },
    "os:ports": {
        async execute(args) {
            await ports_1.default();
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
        console.log(`CLI to interact with obniz

VERSION
  obniz-cli/${packageverion}

USAGE
  $ obniz-cli [COMMAND]

COMMANDS

  login       Login to obniz cloud.

  gui         Launch GUI mode of obniz-cli

  os:create   Flashing and configure target device and registrate it on your account on obnizCloud.
               ARGS: -h XXX -v X.X.X -p XXX -b XXX -config XXXX -continue yes
  os:flash    Flashing and configure target device.
               ARGS: -h XXX -v X.X.X -p XXX -b XXX -k XXXX -config XXXX -continue yes
  os:erase    Fully erase a flash on target device.
               ARGS: -p XXX
  os:terminal Simply Launch terminal
               ARGS: -p XXX
  os:ports    Getting serial ports on your machine.
  `);
    },
};
arg_1.default(routes)
    .then(() => { })
    .catch((e) => {
    console.error(e);
    process.exit(1);
});
