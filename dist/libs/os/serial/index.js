"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const serialport_1 = __importDefault(require("serialport"));
const baudRate = 115200;
class Serial {
    constructor(obj) {
        this.totalReceived = "";
        this.portname = obj.portname;
        this.stdout = obj.stdout;
        this.onerror = obj.onerror;
    }
    async open() {
        return new Promise(async (resolve, reject) => {
            this.serialport = new serialport_1.default(this.portname, { baudRate });
            this.serialport.on("open", () => {
                // open logic
                this.serialport.set({ rts: false, dtr: false });
                console.log(`serial open ${this.portname}`);
                this.serialport.on("readable", async () => {
                    const received = this.serialport.read().toString("utf-8");
                    this.totalReceived += received;
                    this.stdout(received);
                    if (this._recvCallback) {
                        this._recvCallback();
                    }
                });
                resolve();
            });
            this.serialport.on("error", (err) => {
                reject(err);
                if (this.onerror) {
                    this.onerror(err);
                }
            });
        });
    }
    async close() {
        return new Promise((resolve, reject) => {
            this.serialport.close(() => {
                resolve();
            });
        });
    }
    clearReceived() {
        this.totalReceived = "";
    }
    /**
     *
     * @param key
     * @param timeout
     */
    async waitFor(key, timeout = 20 * 1000) {
        return new Promise((resolve, reject) => {
            const timeoutTimer = setTimeout(() => {
                this._recvCallback = null;
                reject(new Error("Timeout"));
            }, timeout);
            this._recvCallback = () => {
                if (this.totalReceived.indexOf(`${key}`) >= 0) {
                    if (timeoutTimer) {
                        clearTimeout(timeoutTimer);
                    }
                    this._recvCallback = null;
                    resolve();
                }
            };
        });
    }
    /**
     * Sending a text
     * @param text
     */
    send(text) {
        try {
            this.serialport.write(`${text}`);
            this.totalReceived = "";
        }
        catch (e) {
            this.stdout("" + e);
        }
    }
    /**
     * Setting a Devicekey.
     * @param devicekey
     */
    async setDeviceKey(devicekey) {
        console.log(`
***
Setting DeviceKey ${devicekey}
***
    `);
        this.send(`\n`); // force print DeviceKey
        await this.waitFor("DeviceKey", 5 * 1000);
        this.send(`${devicekey}\n`);
        this.clearReceived();
        const obnizid = devicekey.split("&")[0];
        await this.waitFor(`obniz id: ${obnizid}`, 5 * 1000);
    }
}
exports.default = Serial;
