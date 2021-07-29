import { PromiseType } from "utility-types";
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

  public static checkCanWriteFromCli(operation: PromiseType<ReturnType<typeof Operation.getByOperationName>>) {
    if (!operation || !operation.node) {
      throw new Error("operation not found");
    }
    if (operation.node.needLocationNote) {
      throw new Error("Cannot use location note from obniz-cli");
    }
    if (operation.node.needPicEvidence) {
      throw new Error("Cannot use evidence picture from obniz-cli");
    }
    if (operation.node.completionLevel !== 0) {
      throw new Error(
        "obniz-cli only support operation criteria of completion for 'App and network settings are being written'. ",
      );
    }
  }
}
