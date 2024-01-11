import { PromiseType } from "utility-types";
export declare class Operation {
    static getList(token?: string): Promise<import("../generated/client").Maybe<{
        __typename?: "operationEdge" | undefined;
    } & Pick<import("../generated/client").OperationEdge, "facilityName" | "amountExpectedDevices" | "amountOperatedDevices" | "amountReport" | "errorLevelReport"> & {
        node?: ({
            __typename?: "operation" | undefined;
        } & Pick<import("../generated/client").Operation, "id" | "createdAt" | "name" | "facilityId" | "completionLevel" | "needPicEvidence" | "needLocationNote" | "dueDate" | "operationKey">) | null | undefined;
    }>[]>;
    static getByOperationName(token: string, name: string): Promise<({
        __typename?: "operationEdge" | undefined;
    } & Pick<import("../generated/client").OperationEdge, "facilityName" | "amountExpectedDevices" | "amountOperatedDevices" | "amountReport" | "errorLevelReport"> & {
        node?: ({
            __typename?: "operation" | undefined;
        } & Pick<import("../generated/client").Operation, "id" | "createdAt" | "name" | "facilityId" | "completionLevel" | "needPicEvidence" | "needLocationNote" | "dueDate" | "operationKey">) | null | undefined;
    }) | null | undefined>;
    static checkPermission(token: string): Promise<boolean>;
    static checkCanWriteFromCli(operation: PromiseType<ReturnType<typeof Operation.getByOperationName>>): void;
}
