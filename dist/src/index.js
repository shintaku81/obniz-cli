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
const erase_1 = __importDefault(require("./libs/erase"));
const ports_1 = __importDefault(require("./ports"));
const serialport_guess_1 = __importDefault(require("./libs/serialport_guess"));
const DEFAULT_BAUD = 1500000;
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
const routes = {
    "login": {},
    "os:create": {},
    "os:flash": {},
    "os:erase": {
        async execute(args) {
            let portname = args.p || args.port;
            if (!portname) {
                portname = await serialport_guess_1.default();
            }
            let baud = args.b || args.baud;
            if (!baud) {
                baud = DEFAULT_BAUD;
            }
            if (!portname) {
                console.log(`No port defined. And auto detect failed`);
                process.exit(0);
            }
            await erase_1.default({
                portname,
                baud,
                stdout: (text) => {
                    console.log(text);
                },
            });
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
  obniz-cli/${require("../package.json").version}

USAGE
  $ obniz-cli [COMMAND]

COMMANDS

  login       Login to obniz cloud.

  gui         Launch GUI mode of obniz-cli

  os:create   Flashing and configure target device and registrate it on your account on obnizCloud.
               ARGS: -hw XXX -v X.X.X -p XXX -config XXXX -continue yes
  os:flash    Flashing and configure target device.
               ARGS: -hw XXX -v X.X.X -p XXX -key XXXX -config XXXX -continue yes
  os:erase    Fully erase a flash on target device.
               ARGS: -p XXX
  os:ports    Getting serial ports on your machine.
  `);
    },
};
arg_1.default(routes)
    .then(() => { })
    .catch((e) => {
    throw e;
});
