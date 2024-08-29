import { GraphQLClient } from "graphql-request";
import { DeviceCreateInput, getSdk } from "../generated/client.js";
import { getClientSdk } from "./sdk.js";
import { GraphQLURL } from "./url.js";

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
    return ret.createDevice!;
  }

  public static async checkReadPermission(token: string) {
    try {
      const sdk = getClientSdk(token);
      const ret = await sdk.getTokenPermission();
      const permission = ret.token?.device || "none";
      return permission === "read" || permission === "full";
    } catch (e) {
      return false;
    }
  }

  public static async checkCreatePermission(token: string) {
    try {
      const sdk = getClientSdk(token);
      const ret = await sdk.getTokenPermission();
      const permission = ret.token?.device || "none";
      return permission === "full";
    } catch (e) {
      return false;
    }
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
    const device = ret.devices?.edges.find((e) => true)?.node || null;

    return device;
  }
}
