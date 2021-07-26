import { GraphQLClient } from "graphql-request";
import { DeviceCreateInput, getSdk, MutationCreateDeviceArgs } from "../generated/client";
import { GraphQLURL } from "./url";

export default class Device {
  public static async create(token?: string, opt: any = {}) {
    const headers: any = {};
    if (token) {
      headers.authorization = `Bearer ${token}`;
    }

    const input: DeviceCreateInput = {
      description: opt.description ? opt.description : "",
      hardware: opt.hardware ? opt.hardware : "esp32w",
      region: opt.region ? opt.region : "jp",
    };
    if (opt.serialdata) {
      input.serialdata = opt.serialdata;
    }

    const graphQLClient = new GraphQLClient(GraphQLURL, {
      headers,
    });
    const sdk = getSdk(graphQLClient);

    const ret = await sdk.createDevice({ createDeviceDevice: input });
    return ret.createDevice;
  }

  public static async get(token: string, id: string) {
    const headers: any = {};
    if (token) {
      headers.authorization = `Bearer ${token}`;
    }
    const graphQLClient = new GraphQLClient(GraphQLURL, {
      headers,
    });
    const sdk = getSdk(graphQLClient);
    const ret = await sdk.getDeviceById({ deviceId: id });
    let device = null;
    for (const edge of ret.devices.edges) {
      device = edge.node;
      break;
    }
    return device;
  }
}
