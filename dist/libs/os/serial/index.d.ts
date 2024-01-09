import SerialPort from "serialport";
export default class Serial {
    portname: string;
    stdout: any;
    onerror: any;
    progress: any;
    serialport: SerialPort | undefined;
    totalReceived: string;
    private _recvCallback;
    constructor(obj: {
        portname: string;
        stdout: any;
        onerror: any;
        progress: any;
    });
    open(): Promise<unknown>;
    close(): Promise<unknown>;
    clearReceived(): void;
    /**
     *
     */
    reset(): Promise<void>;
    waitFor(key: string, timeout?: number | undefined): Promise<unknown>;
    detectedObnizOSVersion(): Promise<{
        version: string;
        obnizid: string;
    }>;
    /**
     * <3.5.0
     */
    waitForSettingMode(): Promise<void>;
    /**
     * >= 3.5.0
     */
    enterMenuMode(): Promise<void>;
    /**
     * Sending a text
     * @param text
     */
    send(text: string): void;
    /**
     * Setting a Devicekey.
     * @param devicekey
     */
    setDeviceKey(devicekey: string): Promise<void>;
    /**
     * Setting Network Type.
     * @param type
     */
    setAllFromMenu(json: any): Promise<void>;
    /**
     * Setting Network Type.
     * @param type
     */
    setNetworkType(type: "wifi" | "ethernet" | "cellular"): Promise<void>;
    /**
     * Setting WiFi
     * @param obj
     */
    setWiFi(setting: any): Promise<void>;
    private _tryCloseOpenSerial;
    private _searchLine;
}
