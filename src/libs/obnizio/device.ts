import { GraphQLClient } from "graphql-request";
import { GraphQLURL } from "./url";

export default class Device {
  public static async create(token?: string, opt: any = {}) {
    const headers: any = {};
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

    const graphQLClient = new GraphQLClient(GraphQLURL, {
      headers,
    });
    const ret = await graphQLClient.request(obj);
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
