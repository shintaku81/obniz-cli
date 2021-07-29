"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_request_1 = require("graphql-request");
const client_1 = require("../generated/client");
const url_1 = require("./url");
exports.default = async (token) => {
    const graphQLClient = new graphql_request_1.GraphQLClient(url_1.GraphQLURL, {
        headers: {
            authorization: `Bearer ${token}`,
        },
    });
    const sdk = client_1.getSdk(graphQLClient);
    const ret = await sdk.currentUser();
    return ret.user || null;
};
//# sourceMappingURL=user.js.map