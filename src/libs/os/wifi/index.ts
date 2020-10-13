import chalk from "chalk";
import wifi from "node-wifi";

export default class WiFi {
  public stdout: any;
  public onerror: any;

  constructor(obj: { stdout: any; onerror: any }) {
    this.stdout = obj.stdout;
    this.onerror = obj.onerror;
    wifi.init({
      iface: null,
    });
  }

  public async setWiFi(setting: any) {
    console.log(
      chalk.yellow(`
***
Setting Network
***
      `),
    );
    const networks = await this.selectObnizWiFi();
    const url = "http://192.168.0.1/";
    const params = this.createSettingData(setting);
    const options = {
      method: "POST",
      body: params,
    };
    for (const network of networks) {
      // Connect access point
      let failFlag = false;
      await wifi.connect({ ssid: network.ssid }).catch((err) => {
        console.log(chalk.red(`Failed to connect ${network.ssid}`));
        failFlag = true;
      });
      if (failFlag) {
        continue;
      }
      console.log(`Connected to ${network.ssid}`);

      // Send HTTP Request
      const res = await fetch(url, options).catch((err) => {
        throw new Error(err);
      });
      if (res.status === 200) {
        console.log(
          chalk.green(`
***
Configration Successfull of ${network.ssid}`),
        );
        console.log(chalk.green(JSON.stringify(setting, null, 2)));
        console.log(chalk.green(`***`));
      } else {
        console.log(chalk.red(`Failed to set up ${network.ssid}`));
      }
    }
  }

  private createSettingData(setting: any) {
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

    return params;
  }

  private scanObnizWiFi(timeout: number): Promise<any> {
    console.log(`Searching connectable obniz...`);
    return new Promise(async (resolve, reject) => {
      let timer = setTimeout(() => {
        reject(new Error(`Timeout. Cannot find any connectable obniz.`));
      }, timeout);

      while (true) {
        const networks = await wifi.scan().catch((err) => {
          reject(new Error(err));
        });
        const obnizNetworks = [];
        console.log(networks);
        for (const network of networks) {
          if (network.ssid.startsWith("obniz-")) {
            obnizNetworks.push(network);
          }
        }

        if (obnizNetworks.length === 0) {
          continue;
        } else {
          clearTimeout(timer);
          timer = null;
          resolve(obnizNetworks);
          break;
        }
      }
    });
  }

  private async selectObnizWiFi(): Promise<any> {
    const readline = require("readline");
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    return new Promise(async (resolve, reject) => {
      const obnizNetworks = await this.scanObnizWiFi(30 * 1000).catch((err) => {
        reject(new Error(err));
      });

      if (obnizNetworks.length === 1) {
        console.log(`Found 1 connectable obniz(${obnizNetworks[0].ssid}).`);
        rl.question(`Apply Wi-Fi setting to this obniz? (y or n)`, (answer) => {
          rl.close();
          if (answer === "y") {
            resolve(obnizNetworks);
          } else if (answer === "n") {
            resolve([]);
          } else {
            reject(new Error(`Input y or n`));
          }
        });
      } else {
        console.log(`Found some connectable obniz.`);
        for (let i; i < obnizNetworks.length; i++) {
          console.log(`${i} : ${obnizNetworks[i].ssid}`);
        }
        rl.question(
          `Select obniz to apply Wi-Fi setting. (Integer from 0 to ${obnizNetworks.length - 1}, or if all, input a)`,
          (answer) => {
            rl.close();
            if (answer === "a") {
              resolve(obnizNetworks);
            } else {
              const selectedNetwork = obnizNetworks[answer];
              if (selectedNetwork) {
                resolve([selectedNetwork]);
              } else {
                reject(new Error(`Input integer from 0 to ${obnizNetworks.length - 1}, or if all, input a`));
              }
            }
          },
        );
      }
    });
  }
}
