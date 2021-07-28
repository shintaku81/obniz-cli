"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.networkConfigValidate = exports.deviceConfigValidate = void 0;
const chalk_1 = __importDefault(require("chalk"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const defaults_1 = __importDefault(require("../../defaults"));
const device_1 = __importDefault(require("../obnizio/device"));
const operation_1 = require("../obnizio/operation");
const Storage = __importStar(require("../storage"));
const configure_1 = __importDefault(require("./configure"));
const prepare_1 = __importDefault(require("./serial/prepare"));
const ora_1 = __importDefault(require("ora"));
async function deviceConfigValidate(args, obj = {}, logging = false) {
    const devicekey = args.d || args.devicekey;
    let obniz_id = null;
    if (devicekey) {
        obj.configs = obj.configs || {};
        obj.configs.devicekey = devicekey;
        obniz_id = devicekey.split("&")[0];
    }
    if (args.i || args.id) {
        const spinner = logging ? ora_1.default(`Configure: Opening Serial Port ${chalk_1.default.green(obj.portname)}`).start() : null;
        try {
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
            if (!device.devicekey) {
                throw new Error(`device ${obniz_id} has no devicekey.`);
            }
            obj.configs = obj.configs || {};
            obj.configs.devicekey = device.devicekey;
            spinner === null || spinner === void 0 ? void 0 : spinner.succeed(`Configure: obnizID=${device.id} hardware=${device.hardware} devicekey=${device.devicekey}`);
        }
        catch (e) {
            spinner === null || spinner === void 0 ? void 0 : spinner.fail(`Configure: Failed ${e}`);
            throw e;
        }
    }
}
exports.deviceConfigValidate = deviceConfigValidate;
async function networkConfigValidate(args, obj = {}, logging = false) {
    // Network Setting
    const configPath = args.c || args.config || null;
    const operationName = args.op || args.operation || null;
    const indicationName = args.ind || args.indication || null;
    if ((operationName && !indicationName) || (!operationName && indicationName)) {
        throw new Error("If you want to use operation, set both param of operation and indication.");
    }
    else if (configPath && operationName && indicationName) {
        throw new Error("You cannot use configPath and operation same time.");
    }
    else if (configPath) {
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
    }
    else if (operationName && indicationName) {
        const token = Storage.get("token");
        if (!token) {
            throw new Error(`You need to signin first to use obniz Cloud from obniz-cli.`);
        }
        await operation_1.Operation.checkPermission(token);
        const op = await operation_1.Operation.getByOperationName(token, operationName);
        if (!op) {
        }
    }
}
exports.networkConfigValidate = networkConfigValidate;
async function validate(args, obj = {}, logging = false) {
    await deviceConfigValidate(args, obj, logging);
    await networkConfigValidate(args, obj, logging);
}
exports.validate = validate;
exports.default = {
    help: `Flash obnizOS and configure it

[serial setting]
 -p --port        serial port path to flash.If not specified, the port list will be displayed.
 -b --baud        flashing baud rate. default to ${defaults_1.default.BAUD}

 [configrations]
 -d --devicekey     devicekey to be configured after flash. please quote it like "00000000&abcdefghijklkm"
 -i --id            obnizID to be configured. You need to signin before use this.
 -c --config        configuration file path. If specified obniz-cli proceed settings following file like setting wifi SSID/Password.
 -op --operation    operation id of
 -ind --indication
  `,
    async execute(args) {
        // check input first
        await validate(args);
        // Serial Port Setting
        let received = "";
        const obj = await prepare_1.default(args);
        obj.stdout = (text) => {
            // process.stdout.write(text);
            received += text;
        };
        // set params to obj
        await validate(args, obj, true);
        if (!obj.configs) {
            // no configuration provided
            console.log(`No configuration found. exit.`);
            return;
        }
        await configure_1.default(obj);
    },
};
