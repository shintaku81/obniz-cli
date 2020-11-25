"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const node_wifi_1 = __importDefault(require("node-wifi"));
const ora_1 = __importDefault(require("ora"));
class WiFi {
    constructor(obj) {
        this.stdout = obj.stdout;
        this.onerror = obj.onerror;
        node_wifi_1.default.init({
            iface: null,
        });
    }
    async setNetwork(type, setting, duplicate = true) {
        let spinner;
        const successIds = [];
        while (true) {
            try {
                spinner = ora_1.default(`Wi-Fi Scanning...`).start();
                let networks;
                while (true) {
                    networks = await this.scanObnizWiFi(30 * 1000);
                    if (networks.length === 0) {
                        continue;
                    }
                    break;
                }
                for (let i = 0; i < networks.length; i++) {
                    const network = networks[i];
                    if (!duplicate && successIds[network.ssid]) {
                        continue;
                    }
                    if (i !== 0) {
                        spinner = ora_1.default(``).start();
                    }
                    try {
                        // Connect access point
                        spinner.text = `Found ${chalk_1.default.green(network.ssid)}. Connecting...`;
                        try {
                            await node_wifi_1.default.connect({ ssid: network.ssid });
                        }
                        catch (e) {
                            throw new Error(`Connection to ${chalk_1.default.green(network.ssid)} failed`);
                        }
                        spinner.text = `Connected ${chalk_1.default.green(network.ssid)}. Configuring...`;
                        let getCount = 0;
                        while (true) {
                            await new Promise((resolve) => {
                                setTimeout(resolve, 1000);
                            });
                            try {
                                const getRes = await new Promise((resolve, reject) => {
                                    const timeout = 3000;
                                    setTimeout(() => {
                                        reject(new Error(`Timed out ${timeout}`));
                                    }, timeout);
                                    fetch("http://192.168.0.1/")
                                        .then((result) => {
                                        resolve(result);
                                    })
                                        .catch((e) => {
                                        reject(e);
                                    });
                                });
                                if (getRes.ok) {
                                    break;
                                }
                            }
                            catch (e) {
                                // ignore fetching error
                            }
                            ++getCount;
                            spinner.text = `${chalk_1.default.green(network.ssid)} Connecting HTTP Server... ${getCount}`;
                            if (getCount >= 4) {
                                throw new Error(`${chalk_1.default.green(network.ssid)} HTTP Communication Failed ${getCount} times. abort`);
                            }
                        }
                        // Send HTTP Request
                        let url = "http://192.168.0.1/";
                        if (type === "wifi") {
                            url = "http://192.168.0.1/";
                        }
                        else if (type === "cellular") {
                            url = "http://192.168.0.1/lte";
                        }
                        const options = this.createSettingData(type, setting);
                        const res = await fetch(url, options);
                        if (res.status === 200) {
                            spinner.succeed(`Configuration sent ${chalk_1.default.green(network.ssid)}`);
                            successIds[network.ssid] = true;
                        }
                        else {
                            throw new Error(`Configuration failed ${chalk_1.default.green(network.ssid)}`);
                        }
                    }
                    catch (e) {
                        spinner.fail(`${chalk_1.default.green(network.ssid)} Configuration failed reson=${e.toString()}`);
                    }
                }
            }
            catch (e) {
                spinner.fail(`${e.toString()}`);
            }
        }
    }
    createSettingData(type, setting) {
        const options = {
            method: "POST",
        };
        if (type === "wifi") {
            const urlSetting = {
                ssid: setting.ssid,
                pw: setting.password,
                si: "",
                nm: "",
                gw: "",
                ds: "",
                proxy_ip: "",
                proxy_port: "",
            };
            if (setting.dhcp === false) {
                urlSetting.si = setting.static_ip;
                urlSetting.nm = setting.subnetmask;
                urlSetting.gw = setting.default_gateway;
                urlSetting.ds = setting.dns;
            }
            if (setting.proxy) {
                urlSetting.proxy_ip = setting.proxy_address;
                urlSetting.proxy_port = setting.proxy_port;
            }
            const params = new URLSearchParams();
            Object.keys(urlSetting).forEach((key) => params.append(key, urlSetting[key]));
            options.body = params;
        }
        else if (type === "cellular") {
            const urlSetting = setting;
            const params = new URLSearchParams();
            Object.keys(urlSetting).forEach((key) => params.append(key, urlSetting[key]));
            options.body = params;
        }
        return options;
    }
    // private scanObnizWiFi(timeout: number): Promise<any> {
    //   console.log(`Searching connectable obniz...`);
    //   return new Promise(async (resolve, reject) => {
    //     let timer = setTimeout(() => {
    //       reject(new Error(`Timeout. Cannot find any connectable obniz.`));
    //     }, timeout);
    //     while (true) {
    //       const networks = await wifi.scan().catch((err) => {
    //         reject(new Error(err));
    //       });
    //       const obnizNetworks = [];
    //       for (const network of networks) {
    //         if (network.ssid.startsWith("obniz-")) {
    //           obnizNetworks.push(network);
    //         }
    //       }
    //       if (obnizNetworks.length === 0) {
    //         continue;
    //       } else {
    //         clearTimeout(timer);
    //         timer = null;
    //         resolve(obnizNetworks);
    //         break;
    //       }
    //     }
    //   });
    // }
    scanObnizWiFi(timeout) {
        return new Promise(async (resolve, reject) => {
            const timer = setTimeout(() => {
                reject(new Error(`Timeout. Cannot find any connectable obniz.`));
            }, timeout);
            node_wifi_1.default.scan((error, networks) => {
                if (error) {
                    clearTimeout(timer);
                    reject(error);
                    return;
                }
                const obnizwifis = [];
                for (const network of networks) {
                    if (network.ssid.startsWith("obniz-")) {
                        obnizwifis.push(network);
                    }
                }
                clearTimeout(timer);
                resolve(obnizwifis);
            });
        });
    }
}
exports.default = WiFi;
