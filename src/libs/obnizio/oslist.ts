import { GraphQLClient } from "graphql-request";

export default async (hardware: string, token?:string) => {
  let headers:any = {}
  if (token) {
    headers.authorization = `Bearer ${token}`
  }
  const graphQLClient = new GraphQLClient(`https://api.obniz.io/v1/graphql`, {
    headers
  });
  const query = `{
    os(hardware: "${hardware}") {
      version,
      app_url,
      bootloader_url,
      partition_url
    }
  }`;

  const ret = await graphQLClient.request(query);
  return ret.os
}

