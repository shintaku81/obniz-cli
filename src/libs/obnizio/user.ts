import { GraphQLClient } from "graphql-request";

export default async (token: string) => {
  const graphQLClient = new GraphQLClient(`https://api.obniz.io/v1/graphql`, {
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
