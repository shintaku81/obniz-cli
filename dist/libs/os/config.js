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
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const defaults_1 = __importDefault(require("../../defaults"));
const device_1 = __importDefault(require("../obnizio/device"));
const Storage = __importStar(require("../storage"));
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
 -d --devicekey   devicekey to be configured after flash. please quote it like "00000000&abcdefghijklkm"
 -i --id          obnizID to be configured. You need to signin before use this.
 -c --config      configuration file path. If specified obniz-cli proceed settings following file like setting wifi SSID/Password.
 -v --via         serial(physically connected) or wifi. default is set to serial.
  `,
    async execute(args) {
        // Serial Port Setting
        const obj = await preparePort(args);
        obj.stdout = (text) => {
            process.stdout.write(text);
        };
        // DeviceKey Setting
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
            console.log(chalk_1.default.green(`
***
device ${obniz_id}
  description: ${device.description}
  createdAt: ${device.createdAt}
  hardware: ${device.hardware}
  status: ${device.status}
  devicekey: ${device.devicekey}
***
      `));
            if (!device.devicekey) {
                throw new Error(`device ${obniz_id} has no devicekey.`);
            }
            obj.configs = obj.configs || {};
            obj.configs.devicekey = device.devicekey;
        }
        // Network Setting
        const configPath = args.c || args.config;
        if (configPath) {
            const filepath = path_1.default.isAbsolute(configPath) ? configPath : path_1.default.join(process.cwd(), configPath);
            if (!fs_1.default.existsSync(filepath)) {
                throw new Error(`config file ${filepath} does not exist!!`);
            }
            const jsonString = fs_1.default.readFileSync(filepath, { encoding: "utf8" });
            let json = null;
            try {
                json = JSON.parse(jsonString);
            }
            catch (e) {
                console.error(`Can't read config file as json`);
                throw e;
            }
            obj.configs = obj.configs || {};
            obj.configs.config = json;
            obj.via = args.v || args.via || "serial";
            if (obj.via !== "serial" && obj.via !== "wifi") {
                console.log(`--via option must be specified with "serial" or "wifi".`);
                return;
            }
        }
        //
        if (!obj.configs) {
            // no configration provided
            console.log(`No configration found. exit.`);
            return;
        }
        await configure_1.default(obj);
        console.log(chalk_1.default.green(`
***
configured device.
***
`));
    },
};
