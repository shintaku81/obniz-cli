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
 -p --port        serial port path to flash. If not specified. will be automatically selected.
 -b --baud        flashing baud rate. default to ${defaults_1.default.BAUD}

[flashing setting]
 -h --hardware    hardware to be flashed. default to ${defaults_1.default.HARDWARE}
 -v --version     obnizOS version to be flashed. default to latest one.

[obnizCloud device setting]
 -r --region      device config region
 -d --description device config description
  `,
    async execute(args) {
        // login check
        const token = Storage.get("token");
        if (!token) {
            throw new Error(`You must singin before create device`);
        }
        // flashing os
        const obj = await preparePort(args);
        const region = args.r || args.region || "jp";
        const description = args.d || args.description || "";
        const hardware = args.h || args.hardware || defaults_1.default.HARDWARE;
        let version = args.v || args.version;
        if (!version) {
            version = await os_1.default.latestPublic(hardware);
            console.log(`${version} is the latest for ${hardware}. going to use it.`);
        }
        obj.version = version;
        obj.hardware = hardware;
        obj.stdout = (text) => {
            console.log(text);
        };
        await _flash_1.default(obj);
        // registrate
        const device = await device_1.default.create(token, {
            region,
            description,
            hardware,
        });
        console.log(`
***
created one device on obniz Cloud.
  obnizID: ${device.id}
  region: ${device.region}
  description: ${device.description}

obniz-cli going to flash Devicekey to connected device.
***
    `);
        obj.configs = obj.configs || {};
        obj.configs.devicekey = device.devicekey;
        if (obj.configs) {
            await configure_1.default(obj);
        }
        console.log(`
Finished Device  ${device.id}
    `);
    },
};
