import { GraphQLClient } from "graphql-request";
import { getSdk } from "../generated/client.js";
import { Storage, getDefaultStorage } from "../storage.js";
import { GraphQLURL } from "./url.js";

export function getClientSdk(token?: string) {
  if (!token) {
    token = getDefaultStorage().get("token");
  }
  const graphQLClient = new GraphQLClient(GraphQLURL, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
  const sdk = getSdk(graphQLClient);

  return sdk;
}
