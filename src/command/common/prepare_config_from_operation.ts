import {
  NetworkConfig,
  NetworkConfigBefore3_5_0,
} from "../../libs/os/configure/index.js";
import { Operation } from "../../libs/obnizio/operation.js";
import { OperationSetting } from "../../libs/obnizio/operation_setting.js";
import { PrepareToken } from "./prepare_token.js";

export const PrepareConfigFromOperation = async (input: {
  operation?: string;
  indication?: string;
  token?: string;
}): Promise<{
  config: NetworkConfig | NetworkConfigBefore3_5_0;
  token: string;
  operation: {
    operation: Awaited<ReturnType<(typeof Operation)["getByOperationName"]>>;
    operationSetting: Awaited<
      ReturnType<(typeof OperationSetting)["getByIndication"]>
    >;
  };
} | null> => {
  const operationName: string | null = input.operation || null;
  const indicationName: string | null = input.indication || null;
  if (operationName && !indicationName) {
    throw new Error(
      "If you want to use operation, set both param of operation and indication.",
    );
  } else if (!operationName && indicationName) {
    throw new Error(
      "If you want to use operation, set both param of operation and indication.",
    );
  } else if (!operationName || !indicationName) {
    // &&でもいいが、type specifyのために||を使用
    return null;
  }

  const token = await PrepareToken(input);

  if (!(await Operation.checkPermission(token))) {
    throw new Error(
      `You dont have permission to use operation. Please run 'obniz-cli signin' or set --token param`,
    );
  }
  const op = await Operation.getByOperationName(token, operationName);
  if (!op || !op.node) {
    throw new Error(`Operation not found  '${operationName}'`);
  }

  Operation.checkCanWriteFromCli(op);
  const ops =
    indicationName === "next"
      ? await OperationSetting.getFirstTodoOrWipOne(token, op.node.id || "")
      : await OperationSetting.getByIndication(
          token,
          op.node.id || "",
          indicationName,
        );

  if (!ops || !ops.node) {
    if (indicationName === "next") {
      throw new Error(`Todo indication not found`);
    } else {
      throw new Error(`Indication not found  '${indicationName}'`);
    }
  }
  if (ops.node.status === 2) {
    throw new Error(`Indication already finished  '${indicationName}'`);
  }

  return {
    config: JSON.parse(ops.node.networkConfigs),
    token,
    operation: {
      operation: op,
      operationSetting: ops,
    },
  };
};
