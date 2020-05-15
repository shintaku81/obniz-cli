"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
exports.default = (hw, version, type) => {
    const relative = "../../";
    const map = {
        bootloader: "__bootloader.bin",
        partition: "__partition.bin",
        app: ".bin",
    };
    return path_1.default.join(__dirname, relative, `temp`, `obnizos__${hw}__${version}${map[type]}`);
};
