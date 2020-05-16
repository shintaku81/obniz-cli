"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const defaults_1 = __importDefault(require("../../defaults"));
const os_1 = __importDefault(require("../../libs/obnizio/os"));
const _flash_1 = __importDefault(require("./_flash"));
const config_1 = __importDefault(require("./config"));
const guess_1 = __importDefault(require("./serial/guess"));
async function preparePort(args) {
    let portname = args.p || args.port;
    if (!portname) {
        portname = await guess_1.default();
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
exports.default = {
    help: `Flash obnizOS and configure it

[serial setting]
 -p --port      serial port path to flash. If not specified. will be automatically selected.
 -b --baud      flashing baud rate. default to ${defaults_1.default.BAUD}

[flashing setting]
 -h --hardware  hardware to be flashed. default to ${defaults_1.default.HARDWARE}
 -v --version   obnizOS version to be flashed. default to latest one.

[configrations]
 -d --devicekey devicekey to be configured after flash. please quote it like "00000000&abcdefghijklkm"
 -i --id        obnizID to be configured. You need to signin before use this.
 -c --config    configuration file path. If specified obniz-cli proceed settings following file like setting wifi SSID/Password.
  `,
    async execute(args) {
        // flashing os
        const obj = await preparePort(args);
        obj.stdout = (text) => {
            process.stdout.write(text);
        };
        // OS setting
        let hardware = args.h || args.hardware;
        if (!hardware) {
            hardware = defaults_1.default.HARDWARE;
        }
        obj.hardware = hardware;
        let version = args.v || args.version;
        if (!version) {
            version = await os_1.default.latestPublic(hardware);
            console.log(chalk_1.default.yellow(`${version} is the latest for ${hardware}. going to use it.`));
        }
        obj.version = version;
        await _flash_1.default(obj);
        // Configure it
        args.p = undefined;
        args.port = obj.portname; // 万が一この期間にシリアルポートが新たに追加されるとずれる可能性があるので
        await config_1.default.execute(args);
    },
};
