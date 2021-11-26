"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const esptool_js_1 = require("@9wick/esptool.js");
const serial_1 = require("@9wick/esptool.js/build/node/serial");
const util_1 = require("@9wick/esptool.js/build/util");
const chalk_1 = __importDefault(require("chalk"));
const fs_1 = require("fs");
const ora_1 = __importDefault(require("ora"));
const os_1 = __importDefault(require("../obnizio/os"));
async function flash(obj) {
    const spinner = ora_1.default(`Flashing obnizOS: preparing file for hardware=${chalk_1.default.green(obj.hardware)} version=${chalk_1.default.green(obj.version)}`).start();
    if (obj.debugserial) {
        spinner.stop();
    }
    let port = null;
    let espTool = null;
    try {
        // prepare files
        const files = await os_1.default.prepareLocalFile(obj.hardware, obj.version, (progress) => {
            spinner.text = `Flashing obnizOS: ${progress}`;
        });
        spinner.text = `Flashing obnizOS: Opening Serial Port ${chalk_1.default.green(obj.portname)}`;
        port = new serial_1.EsptoolSerial(obj.portname, {
            baudRate: 115200,
            autoOpen: false,
        });
        await port.open();
        espTool = new esptool_js_1.EspLoader(port, {
            logger: {
                log(message, ...optionalParams) { },
                debug(message, ...optionalParams) { },
                error(message, ...optionalParams) { },
            },
        });
        await espTool.connect();
        const chipName = await espTool.chipName();
        const macAddr = await espTool.macAddr();
        // console.log("chipName", chipName);
        // console.log("macAddr", macAddr);
        await espTool.loadStub();
        if (obj.baud) {
            await espTool.setBaudRate(115200, obj.baud);
        }
        const [bootloaderBin, partitionBin, appBin] = await Promise.all([
            fs_1.promises.readFile(files.bootloader_path),
            fs_1.promises.readFile(files.partition_path),
            fs_1.promises.readFile(files.app_path),
        ]);
        const partitions = [
            {
                name: "bootloader",
                data: bootloaderBin,
                offset: 0x1000,
            },
            {
                name: "partition",
                data: partitionBin,
                offset: 0x8000,
            },
            {
                name: "app",
                data: appBin,
                offset: 0x10000,
            },
        ];
        for (let i = 0; i < partitions.length; i++) {
            await espTool.flashData(partitions[i].data, partitions[i].offset, (idx, cnt) => {
                spinner.text = `Flashing obnizOS: writing ${partitions[i].name} ${Math.floor((idx / cnt) * 100)}%...`;
            });
            await util_1.sleep(100);
        }
        // console.log("successfully written device partitions");
        // console.log("flashing succeeded");
        spinner.succeed(`Flashing obnizOS: Flashed`);
    }
    catch (e) {
        spinner.fail(`Flashing obnizOS: Fail`);
        throw e;
    }
    finally {
        try {
            if (espTool) {
                await espTool.disconnect();
            }
            if (port) {
                port.close();
            }
        }
        catch (e) {
            // nothing
        }
    }
}
exports.default = flash;
//# sourceMappingURL=_flash.js.map