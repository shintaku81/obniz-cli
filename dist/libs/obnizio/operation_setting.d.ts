export declare class OperationSetting {
    static status: {
        Todo: number;
        WorkInProgress: number;
        Finished: number;
    };
    static getList(token: string, operationId: string): Promise<import("../generated/client").Maybe<{
        __typename?: "operationSettingEdge" | undefined;
    } & {
        node?: ({
            __typename?: "operationSetting" | undefined;
        } & Pick<import("../generated/client").OperationSetting, "description" | "id" | "status" | "indicationId" | "operationId" | "networkConfigs" | "appId" | "appConfigs">) | null | undefined;
        operationResult?: ({
            __typename?: "operationResultForOperationSetting" | undefined;
        } & Pick<import("../generated/client").OperationResultForOperationSetting, "obnizId" | "successfullyWrittenAt" | "becomeOnlineAt" | "picUrl" | "locationNote" | "typeError">) | null | undefined;
    }>[]>;
    static getByIndication(token: string, operationId: string, indicationId: string): Promise<({
        __typename?: "operationSettingEdge" | undefined;
    } & {
        node?: ({
            __typename?: "operationSetting" | undefined;
        } & Pick<import("../generated/client").OperationSetting, "description" | "id" | "status" | "indicationId" | "operationId" | "networkConfigs" | "appId" | "appConfigs">) | null | undefined;
        operationResult?: ({
            __typename?: "operationResultForOperationSetting" | undefined;
        } & Pick<import("../generated/client").OperationResultForOperationSetting, "obnizId" | "successfullyWrittenAt" | "becomeOnlineAt" | "picUrl" | "locationNote" | "typeError">) | null | undefined;
    }) | null | undefined>;
    static getFirstTodoOrWipOne(token: string, operationId: string): Promise<({
        __typename?: "operationSettingEdge" | undefined;
    } & {
        node?: ({
            __typename?: "operationSetting" | undefined;
        } & Pick<import("../generated/client").OperationSetting, "description" | "id" | "status" | "indicationId" | "operationId" | "networkConfigs" | "appId" | "appConfigs">) | null | undefined;
        operationResult?: ({
            __typename?: "operationResultForOperationSetting" | undefined;
        } & Pick<import("../generated/client").OperationResultForOperationSetting, "obnizId" | "successfullyWrittenAt" | "becomeOnlineAt" | "picUrl" | "locationNote" | "typeError">) | null | undefined;
    }) | null | undefined>;
    static updateStatus(token: string, operationSettingId: string): Promise<void>;
}
