"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const serial_1 = __importDefault(require("../serial"));
exports.default = async (obj) => {
    // Return if no configs required
    if (!obj.configs) {
        return;
    }
    // Open aport
    const serial = new serial_1.default({
        portname: obj.portname,
        stdout: obj.stdout,
        onerror: (err) => {
            throw new Error(`${err}`);
        },
    });
    await serial.open();
    // config devicekey
    if (obj.configs.devicekey) {
        await serial.setDeviceKey(obj.configs.devicekey);
    }
    // close serial
    await serial.close();
};
