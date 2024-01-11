export declare function getClientSdk(token?: string): {
    createDevice(variables: import("../generated/client").Exact<{
        createDeviceDevice: import("../generated/client").DeviceCreateInput;
    }>): Promise<import("../generated/client").CreateDeviceMutation>;
    getDeviceById(variables?: import("../generated/client").Exact<{
        deviceId?: string | null | undefined;
    }> | undefined): Promise<import("../generated/client").GetDeviceByIdQuery>;
    createOperationResult(variables: import("../generated/client").Exact<{
        createOperationResultOperationResult: import("../generated/client").CreateOperationResultInput;
    }>): Promise<import("../generated/client").CreateOperationResultMutation>;
    getOperation(variables?: import("../generated/client").Exact<{
        operationsId?: number | null | undefined;
    }> | undefined): Promise<import("../generated/client").GetOperationQuery>;
    getOperationSettings(variables?: import("../generated/client").Exact<{
        operationSettingsOperationId?: string | null | undefined;
    }> | undefined): Promise<import("../generated/client").GetOperationSettingsQuery>;
    getOperations(variables?: import("../generated/client").Exact<{
        [key: string]: never;
    }> | undefined): Promise<import("../generated/client").GetOperationsQuery>;
    removeOperationResult(variables: import("../generated/client").Exact<{
        removeOperationResultOperationSettingId: string;
    }>): Promise<import("../generated/client").RemoveOperationResultMutation>;
    updateOperationSettingStatus(variables: import("../generated/client").Exact<{
        updateStatusOperationSettingOperationSettingId: string;
    }>): Promise<import("../generated/client").UpdateOperationSettingStatusMutation>;
    getTokenPermission(variables?: import("../generated/client").Exact<{
        [key: string]: never;
    }> | undefined): Promise<import("../generated/client").GetTokenPermissionQuery>;
    currentUser(variables?: import("../generated/client").Exact<{
        [key: string]: never;
    }> | undefined): Promise<import("../generated/client").CurrentUserQuery>;
};
