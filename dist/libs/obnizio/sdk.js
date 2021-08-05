"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_request_1 = require("graphql-request");
const client_1 = require("../generated/client");
const Storage = __importStar(require("../storage"));
const url_1 = require("./url");
function getClientSdk(token) {
    if (!token) {
        token = Storage.get("token");
    }
    const graphQLClient = new graphql_request_1.GraphQLClient(url_1.GraphQLURL, {
        headers: {
            authorization: `Bearer ${token}`,
        },
    });
    const sdk = client_1.getSdk(graphQLClient);
    return sdk;
}
exports.getClientSdk = getClientSdk;
//# sourceMappingURL=sdk.js.map