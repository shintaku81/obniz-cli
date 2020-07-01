import { GraphQLClient } from "graphql-request";
import { GraphQLURL } from "./url";

export default async (token: string) => {
  const graphQLClient = new GraphQLClient(GraphQLURL, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
  const query = `{
    user {
      id,
      name,
      email
    }
  }`;

  const ret = await graphQLClient.request(query);
  return ret.user;
};
