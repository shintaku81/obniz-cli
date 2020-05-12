"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = __importDefault(require("child_process"));
function flash(portname, hardware, version, baud, stdout) {
    return new Promise((resolve, reject) => {
        let received = "";
        let success = false;
        stdout("", { clear: true });
        const cmd = `esptool.py --chip esp32 --port ${portname} --baud ${baud} --before default_reset --after hard_reset write_flash -z --flash_mode dio --flash_freq 40m --flash_size detect 0x1000 ${__dirname}/firmwares/obnizos__${hardware}__${version}__bootloader.bin 0x10000 ${__dirname}/firmwares/obnizos__${hardware}__${version}.bin 0x8000 ${__dirname}/firmwares/obnizos__${hardware}__${version}__partition.bin`;
        const child = child_process_1.default.exec(cmd);
        child.stdout.setEncoding("utf8");
        child.stdout.on("data", (text) => {
            stdout(text);
            received += text;
            if (received.indexOf("Hard resetting...") >= 0) {
                // 終わったっぽい
                success = true;
            }
        });
        child.on("error", (er) => {
            reject(er);
        });
        child.on("exit", () => {
            resolve(success);
        });
    });
}
exports.default = flash;
