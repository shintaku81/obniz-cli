"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
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
    // config network
    if (obj.configs.config) {
        const userconf = obj.configs.config;
        const networks = userconf.networks;
        if (!networks) {
            throw new Error(`please provide "networks". see more detail at example json file`);
        }
        if (!Array.isArray(networks)) {
            throw new Error(`"networks" must be an array`);
        }
        if (networks.length !== 1) {
            throw new Error(`"networks" must have single object in array.`);
        }
        const network = networks[0];
        const type = network.type;
        const settings = network.settings;
        await serial.setNetworkType(type);
        if (type === "wifi") {
            await serial.setWiFi(settings);
        }
        else {
            console.log(chalk_1.default.red(`obniz-cli not supporting settings for ${type} right now. wait for future release`));
        }
    }
    // close serial
    await serial.close();
};
