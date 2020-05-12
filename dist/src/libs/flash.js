"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = __importDefault(require("child_process"));
const filepath_1 = __importDefault(require("./filepath"));
function flash(obj) {
    return new Promise((resolve, reject) => {
        let received = "";
        obj.stdout("", { clear: true });
        console.log(`flashing
 serialport: ${obj.portname}
 baud: ${obj.baud}

 hw: ${obj.hardware}
 version: ${obj.version}
`);
        const cmd = `esptool.py --chip esp32 --port ${obj.portname} --baud ${obj.baud} --before default_reset --after hard_reset` +
            ` write_flash` +
            ` -z --flash_mode dio --flash_freq 40m --flash_size detect` +
            ` 0x1000 ${filepath_1.default(obj.hardware, obj.version, "bootloader")}` +
            ` 0x10000 ${filepath_1.default(obj.hardware, obj.version, "app")}` +
            ` 0x8000 ${filepath_1.default(obj.hardware, obj.version, "partition")}`;
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
