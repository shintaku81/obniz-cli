"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Operation = void 0;
const graphql_request_1 = require("graphql-request");
const url_1 = require("../../obnizio/url");
class Operation {
    static async getList(token) {
        const graphQLClient = new graphql_request_1.GraphQLClient(url_1.GraphQLURL, {
            headers: {
                authorization: `Bearer ${token}`,
            },
        });
        const query = `{
    operations {
    edges {
      node {
        name
        id
        facilityId
        completionLevel
        needPicEvidence
        needLocationNote
        dueDate
        operationKey
        createdAt
      }
      facilityName
      amountExpectedDevices
      amountOperatedDevices
      amountReport
      errorLevelReport
    }
  }
  }`;
        const ret = await graphQLClient.request(query);
        return [];
    }
}
exports.Operation = Operation;
