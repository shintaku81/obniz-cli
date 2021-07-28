import { getClientSdk } from "./sdk";

export class Operation {
  public static async getList(token?: string) {
    const sdk = getClientSdk(token);
    const ret = await sdk.getOperations();
    return ret.operations?.edges || [];
  }

  public static async getByOperationName(token: string, name: string) {
    const list = await this.getList(token);
    return list.find((e) => e?.node?.name === name);
  }

  public static async checkPermission(token: string) {
    try {
      await this.getList(token);
      return true;
    } catch (e) {
      return false;
    }
  }
}
