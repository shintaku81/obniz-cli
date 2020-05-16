"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
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
     */
    async reset() {
        await new Promise(async (resolve, reject) => {
            this.serialport.set({
                dtr: false,
            }, (e) => {
                if (e) {
                    reject(e);
                    return;
                }
                resolve();
            });
        });
        await new Promise((resolve, reject) => {
            setTimeout(resolve, 10);
        });
        await new Promise(async (resolve, reject) => {
            this.serialport.set({
                dtr: true,
            }, (e) => {
                if (e) {
                    reject(e);
                    return;
                }
                resolve();
            });
        });
    }
    /**
     *
     * @param key
     * @param timeout
     */
    async waitFor(key, timeout = 20 * 1000) {
        return new Promise((resolve, reject) => {
            let timeoutTimer = setTimeout(() => {
                this._recvCallback = null;
                reject(new Error(`Timeout. waiting for ${key}`));
            }, timeout);
            const check = () => {
                if (this.totalReceived.indexOf(`${key}`) >= 0) {
                    if (timeoutTimer) {
                        clearTimeout(timeoutTimer);
                        timeoutTimer = null;
                    }
                    this._recvCallback = null;
                    resolve();
                }
            };
            this._recvCallback = () => {
                check();
            };
            check();
        });
    }
    /**
     *
     */
    async waitForSettingMode() {
        return new Promise(async (resolve, reject) => {
            let timeoutTimer = setTimeout(() => {
                console.log(chalk_1.default.yellow(`
***
Could you reset your device? Can you press reset button?
***
`));
                timeoutTimer = null;
            }, 3 * 1000);
            try {
                await this.reset();
                await this.waitFor(`Press 's' to setting mode`, 60 * 1000);
                if (timeoutTimer) {
                    clearTimeout(timeoutTimer);
                    timeoutTimer = null;
                }
                resolve();
            }
            catch (e) {
                reject(e);
            }
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
    /**
     * Setting Network Type.
     * @param type
     */
    async setNetworkType(type) {
        console.log(`
***
Setting Network
***
    `);
        await this.waitForSettingMode();
        await this.waitFor("Input char >>", 5 * 1000);
        this.send(`s`);
        await this.waitFor("-----Select Setting-----", 5 * 1000);
        await this.waitFor("Input number >>", 5 * 1000);
        this.clearReceived();
        this.send(`1`); // Interface
        const interfaces = ["wifi", "ethernet", "celluar"];
        const index = interfaces.indexOf(type);
        if (index < 0) {
            throw new Error(`unknown interface type ${type}`);
        }
        this.send(`${index}`);
    }
    /**
     * Setting WiFi
     * @param obj
     */
    async setWiFi(setting) {
        console.log(chalk_1.default.yellow(`
***
Setting Network
***
    `));
        await this.waitFor("--- Select SSID Number ---", 30 * 1000);
        await this.waitFor("Input number >>", 5 * 1000);
        const line = this._searchLine("-- Other Network --");
        if (!line) {
            throw new Error(`Not Supported OS`);
        }
        let leftside = line.split(":")[0];
        leftside = leftside.replace("-", "");
        const indexNumber = parseInt(leftside);
        if (isNaN(indexNumber)) {
            throw new Error(`Failed to parse serial console. LINE="${line}"`);
        }
        this.send(`${indexNumber}\n`);
        this.clearReceived();
        // Hiden
        await this.waitFor("--- Hidden SSID ---", 5 * 1000);
        await this.waitFor("Input number >>", 5 * 1000);
        if (setting.hidden) {
            this.send(`1`);
        }
        else {
            this.send(`0`);
        }
        this.clearReceived();
        // SSID
        await this.waitFor("--- SSID ---", 5 * 1000);
        await this.waitFor("Input text >>", 5 * 1000);
        this.send(`${setting.ssid}\n`);
        this.clearReceived();
        // Password
        await this.waitFor("--- Password ---", 5 * 1000);
        await this.waitFor("Input text >>", 5 * 1000);
        this.send(`${setting.password}\n`);
        this.clearReceived();
        // DHCP
        await this.waitFor("--- select Network ---", 5 * 1000);
        await this.waitFor("Input number >>", 5 * 1000);
        if (setting.dhcp === false) {
            this.send(`1`);
            this.clearReceived();
            await this.waitFor("--- IP Address ---", 5 * 1000);
            await this.waitFor("Input address >>", 5 * 1000);
            this.send(`${setting.static_ip}\n`);
            this.clearReceived();
            await this.waitFor("--- Default Gateway ---", 5 * 1000);
            await this.waitFor("Input address >>", 5 * 1000);
            this.send(`${setting.default_gateway}\n`);
            this.clearReceived();
            await this.waitFor("--- Subnet Mask ---", 5 * 1000);
            await this.waitFor("Input address >>", 5 * 1000);
            this.send(`${setting.subnetmask}\n`);
            this.clearReceived();
            await this.waitFor("--- DNS Address ---", 5 * 1000);
            await this.waitFor("Input address >>", 5 * 1000);
            this.send(`${setting.dns}\n`);
            this.clearReceived();
        }
        else {
            this.send(`0`);
            this.clearReceived();
        }
        // PROXY
        await this.waitFor("--- Proxy Setting ---", 5 * 1000);
        await this.waitFor("Input number >>", 5 * 1000);
        if (setting.proxy) {
            this.send(`1`);
            this.clearReceived();
            await this.waitFor("--- Proxy Config ---", 5 * 1000);
            await this.waitFor("Input text >>", 5 * 1000);
            this.send(`${setting.proxy_address}\n`);
            this.clearReceived();
            await this.waitFor("--- Proxy Port ---", 5 * 1000);
            await this.waitFor("Input number >>", 5 * 1000);
            this.send(`${setting.proxy_port}\n`);
            this.clearReceived();
        }
        else {
            this.send(`0`);
            this.clearReceived();
        }
        await this.waitFor("Wi-Fi Connecting SSID", 5 * 1000);
        console.log(chalk_1.default.green(`
***
Configration Successfull`));
        console.log(chalk_1.default.green(JSON.stringify(setting, null, 2)));
        console.log(chalk_1.default.green(`***
`));
    }
    _searchLine(text) {
        for (const line of this.totalReceived.split("\n")) {
            if (line.indexOf(text) >= 0) {
                return line;
            }
        }
        return null;
    }
}
exports.default = Serial;
