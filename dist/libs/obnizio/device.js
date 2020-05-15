"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_request_1 = require("graphql-request");
class Device {
    static async create(token, opt = {}) {
        const headers = {};
        if (token) {
            headers.authorization = `Bearer ${token}`;
        }
        const obj = `mutation{
      createDevice(device: {
        hardware: "${opt.hardware ? opt.hardware : "esp32w"}",
        region: "${opt.region ? opt.region : "jp"}",
        description: "${opt.description ? opt.description : ""}"
      }){
        id,
        createdAt,
        devicekey,
        region,
        hardware,
        description
      }
    }`;
        const graphQLClient = new graphql_request_1.GraphQLClient(`https://api.obniz.io/v1/graphql`, {
            headers,
        });
        const ret = await graphQLClient.request(obj);
        return ret.createDevice;
    }
    static async get(token, id) {
        const headers = {};
        if (token) {
            headers.authorization = `Bearer ${token}`;
        }
        const graphQLClient = new graphql_request_1.GraphQLClient(`https://api.obniz.io/v1/graphql`, {
            headers,
        });
        const query = `{
      devices(id:"${id}") {
        totalCount,
        pageInfo {
          hasNextPage,
          hasPreviousPage
        },
        edges{
          node {
            id,
            createdAt,
            description,
            devicekey,
            hardware,
            status
          }
        }
      }
    }`;
        const ret = await graphQLClient.request(query);
        let device = null;
        for (const edge of ret.devices.edges) {
            device = edge.node;
            break;
        }
        return device;
    }
}
exports.default = Device;
