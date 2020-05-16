"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const child_process_1 = __importDefault(require("child_process"));
const os_1 = __importDefault(require("../obnizio/os"));
function flash(obj) {
    return new Promise(async (resolve, reject) => {
        // prepare files
        const files = await os_1.default.prepareLocalFile(obj.hardware, obj.version);
        let received = "";
        obj.stdout("", { clear: true });
        console.log(chalk_1.default.yellow(`
***
flashing obnizOS
 serialport: ${obj.portname}
 baud: ${obj.baud}

 hardware: ${obj.hardware}
 version: ${obj.version}
***
`));
        const cmd = `esptool.py --chip esp32 --port ${obj.portname} --baud ${obj.baud} --before default_reset --after hard_reset` +
            ` write_flash` +
            ` -z --flash_mode dio --flash_freq 40m --flash_size detect` +
            ` 0x1000 ${files.bootloader_path}` +
            ` 0x10000 ${files.app_path}` +
            ` 0x8000 ${files.partition_path}`;
        const child = child_process_1.default.exec(cmd);
        child.stdout.setEncoding("utf8");
        child.stdout.on("data", (text) => {
            obj.stdout(text);
            received += text;
        });
        child.stderr.on("data", (text) => {
            obj.stdout(text);
            received += text;
        });
        child.on("error", (er) => {
            console.log(er);
            reject(er);
        });
        child.on("exit", (e) => {
            console.log(e);
            resolve();
        });
    });
}
exports.default = flash;
