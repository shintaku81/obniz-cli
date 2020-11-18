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
const prepare_1 = __importDefault(require("./serial/prepare"));
const inquirer_1 = __importDefault(require("inquirer"));
const ora_1 = __importDefault(require("ora"));
exports.default = {
    help: `Flash obnizOS and configure it

[serial setting]
 -p --port        serial port path to flash.If not specified, the port list will be displayed.
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
        const obj = await prepare_1.default(args);
        obj.stdout = (text) => {
            // process.stdout.write(text);
        };
        const recoveryDeviceString = Storage.get("recovery-device");
        let device;
        if (recoveryDeviceString) {
            const readedDevice = (device = JSON.parse(recoveryDeviceString));
            const use = await askUseRecovery(readedDevice);
            if (use) {
                device = readedDevice;
            }
            else {
                Storage.set("recovery-device", null);
            }
        }
        // No more asking
        let hardware;
        let version;
        let spinner;
        spinner = ora_1.default("obnizOS:").start();
        // hardware
        hardware = args.h || args.hardware || defaults_1.default.HARDWARE;
        obj.hardware = hardware;
        // version
        version = args.v || args.version;
        if (!version) {
            spinner.text = `obnizOS: Connecting obnizCloud to Public Latest Version of hardware=${chalk_1.default.green(hardware)}`;
            version = await os_1.default.latestPublic(hardware);
            spinner.succeed(`obnizOS: [using default] hardware=${chalk_1.default.green(hardware)} version=${chalk_1.default.green(`${version}(Public Latest Version)`)}`);
        }
        else {
            spinner.succeed(`obnizOS: decided hardware=${chalk_1.default.green(hardware)} version=${chalk_1.default.green(version)}`);
        }
        obj.version = version;
        await _flash_1.default(obj);
        if (device) {
            spinner = ora_1.default("obnizCloud:").start();
            spinner.succeed(`obnizCloud: using recovery device obnizID=${chalk_1.default.green(device.id)} description=${chalk_1.default.green(device.description)} region=${chalk_1.default.green(device.region)}`);
        }
        else {
            spinner = ora_1.default("obnizCloud: creating device on obnizCloud...").start();
            try {
                // Device Creation Setting
                const region = args.r || args.region || "jp";
                const description = args.description || "";
                // registrate
                device = await device_1.default.create(token, {
                    region,
                    description,
                    hardware,
                });
                Storage.set("recovery-device", JSON.stringify(device));
                spinner.succeed(`obnizCloud: created device on obnizCloud obnizID=${chalk_1.default.green(device.id)} description=${chalk_1.default.green(device.description)} region=${chalk_1.default.green(device.region)}`);
            }
            catch (e) {
                spinner.fail(`obnizCloud: ${e}`);
                throw e;
            }
        }
        try {
            // Configure it
            args.p = undefined;
            args.port = obj.portname; // 万が一この期間にシリアルポートが新たに追加されるとずれる可能性があるので
            args.devicekey = device.devicekey;
            await config_1.default.execute(args);
            Storage.set("recovery-device", null);
        }
        catch (e) {
            chalk_1.default.yellow(`obnizID ${device.id} device key and information was sotred in recovery file`);
            throw e;
        }
    },
};
async function askUseRecovery(device) {
    const answer = await inquirer_1.default.prompt([
        {
            type: "list",
            name: "yesno",
            message: `Would you like to use recovery device ${device.id} [ ${device.description} ] rather than create one more device? It was failed one last time.`,
            choices: [
                {
                    name: `Yes. I'm going to use recovery.`,
                    value: `yes`,
                },
                {
                    name: `No. Discard it and create new obnizID on obnizCloud`,
                    value: `no`,
                },
            ],
            default: "yes",
        },
    ]);
    return answer.yesno === "yes";
}
