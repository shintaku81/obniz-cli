"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const defaults_1 = __importDefault(require("../../defaults"));
const configure_1 = __importDefault(require("./configure"));
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

 [configrations]
 -d --devicekey devicekey to be configured after flash. please quote it like "00000000&abcdefghijklkm"
  `,
    async execute(args) {
        const obj = await preparePort(args);
        obj.stdout = (text) => {
            process.stdout.write(text);
        };
        const devicekey = args.d || args.devicekey;
        if (devicekey) {
            obj.configs = obj.configs || {};
            obj.configs.devicekey = devicekey;
        }
        await configure_1.default(obj);
    },
};
