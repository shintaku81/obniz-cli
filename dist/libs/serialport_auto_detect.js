"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const serialport_guess_1 = __importDefault(require("./serialport_guess"));
async function waitForPort() {
    while (true) {
        const portPath = await serialport_guess_1.default();
        if (portPath) {
            return portPath;
        }
        await new Promise((resolve) => {
            setTimeout(resolve, 100);
        });
    }
}
exports.default = waitForPort;
