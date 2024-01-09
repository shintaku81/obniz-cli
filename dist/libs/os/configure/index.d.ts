import { PromiseType } from "utility-types";
import { Operation } from "../../obnizio/operation";
import { OperationSetting } from "../../obnizio/operation_setting";
export interface ConfigParam {
    token: string;
    portname: string;
    debugserial?: boolean;
    stdout: (text: string) => void;
    configs: {
        devicekey: string;
        config: NetworkConfig | NetworkConfigBefore3_5_0;
    };
    via: string;
    operation?: {
        operation?: PromiseType<ReturnType<typeof Operation.getByOperationName>>;
        operationSetting?: PromiseType<ReturnType<typeof OperationSetting.getByIndication>>;
    };
}
export declare type NetworkType = "wirelesslan" | "wifimesh" | "wiredlan" | "cellularmodule";
export interface NetworkConfig {
    net: NetworkType;
    wifi?: any;
    wifimesh?: any;
    ether?: any;
    cellular?: any;
    passkey?: string;
    wifi_channel?: string;
}
export interface NetworkConfigBefore3_5_0 {
    networks: Array<{
        type: "wifi" | "ethernet" | "cellular";
        settings: {
            ssid?: string;
            password?: string;
            meshid?: string;
            hidden?: boolean;
            dhcp?: boolean;
            static_ip?: string;
            subnetmask?: string;
            dns?: string;
            proxy?: boolean;
            proxy_address?: string;
            proxy_port?: number;
        };
    }>;
}
declare const _default: (obj: ConfigParam) => Promise<void>;
export default _default;
