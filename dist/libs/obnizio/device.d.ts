export default class Device {
    static create(token?: string, opt?: any): Promise<{
        __typename?: "device" | undefined;
    } & Pick<import("../generated/client").Device, "hardware" | "id" | "createdAt" | "devicekey" | "region" | "description">>;
    static checkReadPermission(token: string): Promise<boolean>;
    static checkCreatePermission(token: string): Promise<boolean>;
    static get(token: string, id: string): Promise<import("../generated/client").Maybe<{
        __typename?: "device" | undefined;
    } & Pick<import("../generated/client").Device, "hardware" | "id" | "createdAt" | "devicekey" | "description" | "status">>>;
}
