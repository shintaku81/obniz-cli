"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const os_1 = __importDefault(require("../obnizio/os"));
const Storage = __importStar(require("../storage"));
exports.default = async (hardware) => {
    const token = Storage.get("token");
    console.log(`
OS versions for ${hardware}
`);
    const versions = await os_1.default.list(hardware, token);
    for (const v of versions) {
        console.log(`  ${v.version}`);
    }
};
