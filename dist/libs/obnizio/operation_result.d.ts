export declare class OperationResult {
    static status: {
        Todo: number;
        WorkInProgress: number;
        Finished: number;
    };
    static createWriteSuccess(token: string, operationSettingId: string, obnizId: string): Promise<void>;
}
