import { GraphQLClient } from "graphql-request";
import { getSdk } from "../generated/client";
import { GraphQLURL } from "./url";

export default async (token: string) => {
  const graphQLClient = new GraphQLClient(GraphQLURL, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
  const sdk = getSdk(graphQLClient);

  const ret = await sdk.currentUser();
  return ret.user;
};
