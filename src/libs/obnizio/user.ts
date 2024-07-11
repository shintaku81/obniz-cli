import { GraphQLClient } from "graphql-request";
import { getSdk } from "../generated/client.js";
import { GraphQLURL } from "./url.js";

export default async (token: string) => {
  const graphQLClient = new GraphQLClient(GraphQLURL, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
  const sdk = getSdk(graphQLClient);

  const ret = await sdk.currentUser();
  return ret.user || null;
};
