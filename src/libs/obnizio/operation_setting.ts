import { getClientSdk } from "./sdk";

export class OperationSetting {
  public static status = {
    Todo: 0,
    WorkInProgress: 1,
    Finished: 2,
  };

  public static async getList(token: string, operationId: string) {
    const sdk = getClientSdk(token);
    const ret = await sdk.getOperationSettings({ operationSettingsOperationId: operationId });
    return ret?.operationSettings?.edges || [];
  }

  public static async getFirstTodoList(token: string, operationId: string) {
    const list = await this.getList(token, operationId);
    return list.find((ops) => ops?.node?.status === this.status.Todo);
  }
}
