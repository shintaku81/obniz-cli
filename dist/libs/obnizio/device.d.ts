export default class Device {
    static create(token?: string, opt?: any): Promise<{
        __typename?: "device" | undefined;
    } & Pick<import("../generated/client").Device, "hardware" | "id" | "createdAt" | "devicekey" | "region" | "description">>;
    static get(token: string, id: string): Promise<import("../generated/client").Maybe<{
        __typename?: "device" | undefined;
    } & Pick<import("../generated/client").Device, "hardware" | "id" | "createdAt" | "devicekey" | "description" | "status">>>;
}
