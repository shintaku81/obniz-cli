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
const operation_setting_1 = require("../obnizio/operation_setting");
const Storage = __importStar(require("../storage"));
exports.default = {
    help: `Show the operation info
   -o --operation   operationId to be show
      --token       Token of api key which use instead of user signin.
  \`,
  `,
    async execute(args) {
        var _a;
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
        const operationName = args.o || args.operation || "";
        const operations = await operation_1.Operation.getList(token);
        const targetOperation = operations.find((o) => { var _a; return ((_a = o === null || o === void 0 ? void 0 : o.node) === null || _a === void 0 ? void 0 : _a.name) === operationName; });
        if (!targetOperation) {
            console.log(`Not found operation "${operationName}" `);
            return;
        }
        const operationSettings = await operation_setting_1.OperationSetting.getList(token, ((_a = targetOperation === null || targetOperation === void 0 ? void 0 : targetOperation.node) === null || _a === void 0 ? void 0 : _a.id) || "");
        const status = {
            0: "Todo",
            1: "Work in progress",
            2: "Finished",
        };
        operationSettings.map((op) => {
            var _a, _b;
            console.log(` - ${(_a = op === null || op === void 0 ? void 0 : op.node) === null || _a === void 0 ? void 0 : _a.indicationId} (${status[(_b = op === null || op === void 0 ? void 0 : op.node) === null || _b === void 0 ? void 0 : _b.status]})`);
        });
    },
};
//# sourceMappingURL=info.js.map