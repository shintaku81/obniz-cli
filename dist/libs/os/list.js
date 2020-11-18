"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
        }
        await list(hardware);
    },
};
async function list(hardware) {
    console.log(`
OS versions for ${hardware}
`);
    const versions = await os_1.default.list(hardware);
    for (const v of versions) {
        console.log(`  ${v.version}`);
    }
}
