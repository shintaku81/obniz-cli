"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_request_1 = require("graphql-request");
const client_1 = require("../generated/client");
const url_1 = require("./url");
class Device {
    static async create(token, opt = {}) {
        const headers = {};
        if (token) {
            headers.authorization = `Bearer ${token}`;
        }
        const input = {
            description: opt.description ? opt.description : "",
            hardware: opt.hardware ? opt.hardware : "esp32w",
            region: opt.region ? opt.region : "jp",
        };
        if (opt.serialdata) {
            input.serialdata = opt.serialdata;
        }
        const graphQLClient = new graphql_request_1.GraphQLClient(url_1.GraphQLURL, {
            headers,
        });
        const sdk = client_1.getSdk(graphQLClient);
        const ret = await sdk.createDevice({ createDeviceDevice: input });
        return ret.createDevice;
    }
    static async get(token, id) {
        const headers = {};
        if (token) {
            headers.authorization = `Bearer ${token}`;
        }
        const graphQLClient = new graphql_request_1.GraphQLClient(url_1.GraphQLURL, {
            headers,
        });
        const sdk = client_1.getSdk(graphQLClient);
        const ret = await sdk.getDeviceById({ deviceId: id });
        let device = null;
        for (const edge of ret.devices.edges) {
            device = edge.node;
            break;
        }
        return device;
    }
}
exports.default = Device;
