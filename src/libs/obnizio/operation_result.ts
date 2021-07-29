import { getClientSdk } from "./sdk";

export class OperationResult {
  public static status = {
    Todo: 0,
    WorkInProgress: 1,
    Finished: 2,
  };

  public static async createWriteSuccess(token: string, operationSettingId: string, obnizId: string) {
    const successfullyWrittenAt = new Date().toISOString();
    const typeError = 0;

    const sdk = getClientSdk(token);
    const ret = await sdk.createOperationResult({
      createOperationResultOperationResult: {
        obnizId,
        successfullyWrittenAt,
        typeError,
        operationSettingId,
      },
    });
  }
}
