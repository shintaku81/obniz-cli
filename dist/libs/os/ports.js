"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const serialport_1 = __importDefault(require("serialport"));
exports.default = async () => {
    const ports = await serialport_1.default.list();
    console.log(`===Found Serial Ports===`);
    for (let i = 0; i < ports.length; i++) {
        console.log(`${i}: ${ports[i].path}`);
    }
    return ports;
};
