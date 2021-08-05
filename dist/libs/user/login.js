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
const login_1 = __importDefault(require("../obnizio/login"));
const user_1 = __importDefault(require("../obnizio/user"));
const Storage = __importStar(require("../storage"));
const ora_1 = __importDefault(require("ora"));
exports.default = async () => {
    let spinner = ora_1.default(`Singin...`).start();
    const token = await login_1.default((text) => {
        spinner.text = text;
    });
    spinner.succeed(`Authenticated.`);
    spinner = ora_1.default(`Getting User Information`).start();
    const user = await user_1.default(token);
    if (!user) {
        spinner.fail("Get user information failed");
        return;
    }
    Storage.set("token", token);
    spinner.succeed(`Sign in as "${user.email}"`);
};
//# sourceMappingURL=login.js.map