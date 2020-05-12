"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = __importDefault(require("child_process"));
exports.default = (obj) => {
    return new Promise((resolve, reject) => {
        let received = "";
        let success = false;
        obj.stdout("", { clear: true });
        const cmd = `esptool.py --chip esp32 --port ${obj.portname} --baud ${obj.baud} erase_flash`;
        const child = child_process_1.default.exec(cmd);
        child.stdout.setEncoding("utf8");
        child.stdout.on("data", (text) => {
            obj.stdout(text);
            received += text;
            if (received.indexOf("Chip erase completed successfully") >= 0) {
                // 終わったっぽい
                success = true;
            }
        });
        child.stderr.on("data", (text) => {
            obj.stdout(text);
            received += text;
        });
        child.on("error", (err) => {
            reject(err);
        });
        child.on("exit", () => {
            resolve(success);
        });
    });
};
