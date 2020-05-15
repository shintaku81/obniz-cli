import { GraphQLClient } from "graphql-request";

export default class Device {

  static async create(token?:string, opt:any = {}) {
    let headers:any = {}
    if (token) {
      headers.authorization = `Bearer ${token}`
    }

    const obj = `mutation{
      createDevice(device: {
        hardware: "${opt.hardware ? opt.hardware : 'esp32w'}",
        region: "${opt.region ? opt.region : 'jp'}",
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

    const graphQLClient = new GraphQLClient(`https://api.obniz.io/v1/graphql`, {
      headers
    });
    const ret = await graphQLClient.request(obj);
    return ret.createDevice;
  }
}