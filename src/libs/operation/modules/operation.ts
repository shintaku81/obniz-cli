import { GraphQLClient } from "graphql-request";
import { GraphQLURL } from "../../obnizio/url";


export class Operation {
  public static async getList(token: string): Promise<Operation[]> {
    const graphQLClient = new GraphQLClient(GraphQLURL, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    const query = `{
    operations {
    edges {
      node {
        name
        id
        facilityId
        completionLevel
        needPicEvidence
        needLocationNote
        dueDate
        operationKey
        createdAt
      }
      facilityName
      amountExpectedDevices
      amountOperatedDevices
      amountReport
      errorLevelReport
    }
  }
  }`;

    const ret = await graphQLClient.request(query);
    return [];
  }
}
