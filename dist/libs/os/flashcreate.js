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
const chalk_1 = __importDefault(require("chalk"));
const defaults_1 = __importDefault(require("../../defaults"));
const os_1 = __importDefault(require("../../libs/obnizio/os"));
const device_1 = __importDefault(require("../obnizio/device"));
const Storage = __importStar(require("../storage"));
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
 -p --port        serial port path to flash. If not specified. will be automatically selected.
 -b --baud        flashing baud rate. default to ${defaults_1.default.BAUD}

[flashing setting]
 -h --hardware    hardware to be flashed. default to ${defaults_1.default.HARDWARE}
 -v --version     obnizOS version to be flashed. default to latest one.

[obnizCloud device setting]
 -r --region      device config region
    --description device config description
 -c --config      configuration file path. If specified obniz-cli proceed settings following file like setting wifi SSID/Password.
  `,
    async execute(args) {
        // If device related configration exist
        // It is not allowed. because device will be created from me.
        if (args.d || args.devicekey || args.i || args.id) {
            throw new Error(`You can't pass devicekey/id arguments. Because flash-create will create new device.`);
        }
        // login check
        const token = Storage.get("token");
        if (!token) {
            throw new Error(`You must singin before create device`);
        }
        // SerialPortSetting
        const obj = await preparePort(args);
        obj.stdout = (text) => {
            process.stdout.write(text);
        };
        // OS Setting
        const hardware = args.h || args.hardware || defaults_1.default.HARDWARE;
        let version = args.v || args.version;
        if (!version) {
            version = await os_1.default.latestPublic(hardware);
            console.log(`${version} is the latest for ${hardware}. going to use it.`);
        }
        obj.version = version;
        obj.hardware = hardware;
        await _flash_1.default(obj);
        // Device Creation Setting
        const region = args.r || args.region || "jp";
        const description = args.description || "";
        // registrate
        const device = await device_1.default.create(token, {
            region,
            description,
            hardware,
        });
        console.log(chalk_1.default.green(`
***
created one device on obniz Cloud.
  obnizID: ${device.id}
  region: ${device.region}
  description: ${device.description}

obniz-cli going to flash Devicekey to connected device.
***
    `));
        // Configure it
        args.p = undefined;
        args.port = obj.portname; // 万が一この期間にシリアルポートが新たに追加されるとずれる可能性があるので
        args.devicekey = device.devicekey;
        await config_1.default.execute(args);
    },
};
