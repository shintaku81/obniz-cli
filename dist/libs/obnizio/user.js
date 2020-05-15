"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_request_1 = require("graphql-request");
exports.default = async (token) => {
    const graphQLClient = new graphql_request_1.GraphQLClient(`https://api.obniz.io/v1/graphql`, {
        headers: {
            authorization: `Bearer ${token}`,
        },
    });
    const query = `{
    user {
      id,
      name,
      email
    }
  }`;
    const ret = await graphQLClient.request(query);
    return ret.user;
};
