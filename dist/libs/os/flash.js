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
const defaults_1 = __importDefault(require("../../defaults"));
const os_1 = __importDefault(require("../../libs/obnizio/os"));
const configure_1 = __importDefault(require("../../libs/os/configure"));
const device_1 = __importDefault(require("../obnizio/device"));
const Storage = __importStar(require("../storage"));
const _flash_1 = __importDefault(require("./_flash"));
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
  `,
    async execute(args) {
        // flashing os
        const obj = await preparePort(args);
        let hardware = args.h || args.hardware;
        if (!hardware) {
            hardware = defaults_1.default.HARDWARE;
        }
        obj.hardware = hardware;
        let version = args.v || args.version;
        if (!version) {
            version = await os_1.default.latestPublic(hardware);
            console.log(`${version} is the latest for ${hardware}. going to use it.`);
        }
        obj.version = version;
        // Need something configration after flashing
        const devicekey = args.d || args.devicekey;
        let obniz_id = null;
        if (devicekey) {
            obj.configs = obj.configs || {};
            obj.configs.devicekey = devicekey;
            obniz_id = devicekey.split("&")[0];
        }
        if (args.i || args.id) {
            obniz_id = args.i || args.id;
            if (obj.configs && obj.configs.devicekey) {
                throw new Error(`devicekey and id are double specified.`);
            }
            const token = Storage.get("token");
            if (!token) {
                throw new Error(`You need to signin first to use obniz Cloud from obniz-cli.`);
            }
            const device = await device_1.default.get(token, obniz_id);
            if (!device) {
                throw new Error(`device ${obniz_id} was not found in your devices.`);
            }
            console.log(`
***
device ${obniz_id}
  description: ${device.description}
  createdAt: ${device.createdAt}
  hardware: ${device.hardware}
  status: ${device.status}
  devicekey: ${device.devicekey}
***
      `);
            if (!device.devicekey) {
                throw new Error(`device ${obniz_id} has no devicekey.`);
            }
            obj.configs = obj.configs || {};
            obj.configs.devicekey = device.devicekey;
        }
        obj.stdout = (text) => {
            console.log(text);
        };
        await _flash_1.default(obj);
        if (obj.configs) {
            await configure_1.default(obj);
            console.log(`
***
configured device.
 obniz_id = ${obniz_id}
***
 `);
        }
    },
};
