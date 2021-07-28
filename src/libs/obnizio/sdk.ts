import { GraphQLClient } from "graphql-request";
import { getSdk } from "../generated/client";
import * as Storage from "../storage";
import { GraphQLURL } from "./url";

export function getClientSdk(token?: string) {
  if (!token) {
    token = Storage.get("token");
  }
  const graphQLClient = new GraphQLClient(GraphQLURL, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
  const sdk = getSdk(graphQLClient);

  return sdk;
}
