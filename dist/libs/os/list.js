"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const defaults_1 = __importDefault(require("../../defaults"));
const os_1 = __importDefault(require("../obnizio/os"));
exports.default = {
    help: `List available OS list for hardware.

-h --hardware   hardware identifier. Default to ${defaults_1.default.HARDWARE}
  `,
    async execute(args) {
        let hardware = args.h || args.hardware;
        if (!hardware) {
            hardware = defaults_1.default.HARDWARE;
            await listHardwares();
        }
        await listForHardware(hardware);
    },
};
async function listHardwares() {
    console.log(`
Available Hardwares on obnizCloud
`);
    const hardwares = await os_1.default.hardwares();
    for (const h of hardwares) {
        console.log(`  ${h.hardware}`);
    }
}
async function listForHardware(hardware) {
    console.log(`
Versions for hardware=${chalk_1.default.green(hardware)}
`);
    const versions = await os_1.default.list(hardware);
    for (const v of versions) {
        console.log(`  ${v.version}`);
    }
}
