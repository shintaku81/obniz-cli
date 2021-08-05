"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const operation_1 = require("../obnizio/operation");
const Storage = __importStar(require("../storage"));
exports.default = {
    help: `Show your operation list
      --token       Token of api key which use instead of user signin.
  `,
    async execute(args) {
        const token = args.token || Storage.get("token");
        if (!token) {
            console.log(`Not Sign In`);
            return;
        }
        if (!(await operation_1.Operation.checkPermission(token))) {
            console.log(`You don't have Facility permission. Please 'obniz-cli signin' again`);
            return;
        }
        console.log(`Contacting to obniz Cloud...`);
        const operations = await operation_1.Operation.getList(token);
        operations.map((op) => {
            var _a;
            console.log(`${(_a = op === null || op === void 0 ? void 0 : op.node) === null || _a === void 0 ? void 0 : _a.name} (${op === null || op === void 0 ? void 0 : op.facilityName})`);
        });
    },
};
//# sourceMappingURL=list.js.map