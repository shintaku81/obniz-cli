"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process = __importStar(require("child_process"));
async function start() {
    delete process.env.ELECTRON_RUN_AS_NODE;
    child_process.spawnSync("./node_modules/.bin/electron", ["dist/gui/main.js"], {
        env: Object.assign({}, process.env),
        stdio: "inherit",
    });
}
exports.start = start;
//# sourceMappingURL=index.js.map