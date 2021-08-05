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
const user_1 = __importDefault(require("../obnizio/user"));
const Storage = __importStar(require("../storage"));
exports.default = async () => {
    const token = Storage.get("token");
    if (!token) {
        console.log(`Not Sign In`);
        return;
    }
    console.log(`Contacting to obniz Cloud...`);
    const user = await user_1.default(token);
    if (!user) {
        console.log(`Authentication Failed.`);
        return;
    }
    console.log(`Signin In User`);
    console.log(` name : ${user.name}`);
    console.log(` email: ${user.email}`);
};
//# sourceMappingURL=info.js.map