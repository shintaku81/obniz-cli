"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Operation = void 0;
const sdk_1 = require("./sdk");
class Operation {
    static async getList(token) {
        var _a;
        const sdk = sdk_1.getClientSdk(token);
        const ret = await sdk.getOperations();
        return ((_a = ret.operations) === null || _a === void 0 ? void 0 : _a.edges) || [];
    }
    static async getByOperationName(token, name) {
        const list = await this.getList(token);
        return list.find((e) => { var _a; return ((_a = e === null || e === void 0 ? void 0 : e.node) === null || _a === void 0 ? void 0 : _a.name) === name; });
    }
    static async checkPermission(token) {
        try {
            await this.getList(token);
            return true;
        }
        catch (e) {
            return false;
        }
    }
}
exports.Operation = Operation;
