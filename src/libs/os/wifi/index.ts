import chalk from "chalk";
import wifi from "node-wifi";
import ora from "ora";

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

  public async setNetwork(type: string, setting: any, duplicate: boolean = true) {
    let spinner;
    let successIds = [];
    while (true) {
      try {
        spinner = ora(`Wi-Fi Scanning...`).start();
        let networks;
        while(true) {
          networks = await this.scanObnizWiFi(30 * 1000);
          if (networks.length === 0)  {
            continue; 
          }
          break;
        }
        for (let i=0; i<networks.length; i++) {
          const network = networks[i]
          if (!duplicate && successIds[network.ssid]) {
            continue;
          }
          if (i !== 0) {
            spinner = ora(``).start();
          }
          try {
            // Connect access point
            spinner.text = `Found ${chalk.green(network.ssid)}. Connecting...`
            try {
              await wifi.connect({ ssid: network.ssid })
            } catch(e) {
              throw new Error(`Connection to ${chalk.green(network.ssid)} failed`);
            }
            spinner.text = `Connected ${chalk.green(network.ssid)}. Configuring...`

            await new Promise((resolve) => {setTimeout(resolve, 300)});

            // Send HTTP Request
            let url = "http://192.168.0.1/";
            if (type === 'wifi') {
              url = "http://192.168.0.1/";
            } else if (type === "cellular") {
              url = "http://192.168.0.1/lte";
            }
            const options = this.createSettingData(type, setting);
            const res = await fetch(url, options);
            if (res.status === 200) {
              spinner.succeed(`Configuration sent ${chalk.green(network.ssid)}`)
              successIds[network.ssid] = true;
            } else {
              throw new Error(`Configuration failed ${chalk.green(network.ssid)}`);
            }
          } catch(e) {
            spinner.fail(`${e.toString()}`);
          }
        }
      }catch(e) {
        spinner.fail(`${e.toString()}`);
      }
    }
  }

  private createSettingData(type:string, setting: any) {
    const options:any = {
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
    } else if (type === "cellular") {
      const urlSetting = setting;
      const params = new URLSearchParams();
      Object.keys(urlSetting).forEach((key) => params.append(key, urlSetting[key]));
      options.body = params;
    }
    return options
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

  private scanObnizWiFi(timeout: number): Promise<any> {
    return new Promise(async (resolve, reject) => {
      let timer = setTimeout(() => {
        reject(new Error(`Timeout. Cannot find any connectable obniz.`));
      }, timeout);

      wifi.scan((error, networks) => {
        if (error) {
          clearTimeout(timer);
          reject(error);
          return;
        }
        let obnizwifis = []
        for (const network of networks) {
          if (network.ssid.startsWith("obniz-")) {
            obnizwifis.push(network);
          }
        }
        clearTimeout(timer);
        resolve(obnizwifis);
      })
    });
  }

  // private async selectObnizWiFi(): Promise<any> {
  //   const readline = require("readline");
  //   const rl = readline.createInterface({
  //     input: process.stdin,
  //     output: process.stdout,
  //   });

  //   return new Promise(async (resolve, reject) => {
  //     const obnizNetworks = await this.scanObnizWiFi(3 * 1000)

  //     if (obnizNetworks.length === 1) {
  //       console.log(`Found 1 connectable obniz(${obnizNetworks[0].ssid}).`);
  //       resolve(obnizNetworks);
  //     } else {
  //       console.log(`Found some connectable obniz.`);
  //       for (let i; i < obnizNetworks.length; i++) {
  //         console.log(`${i} : ${obnizNetworks[i].ssid}`);
  //       }
  //       rl.question(
  //         `Select obniz to apply Wi-Fi setting. (Integer from 0 to ${obnizNetworks.length - 1}, or if all, input a)`,
  //         (answer) => {
  //           rl.close();
  //           if (answer === "a") {
  //             resolve(obnizNetworks);
  //           } else {
  //             const selectedNetwork = obnizNetworks[answer];
  //             if (selectedNetwork) {
  //               resolve([selectedNetwork]);
  //             } else {
  //               reject(new Error(`Input integer from 0 to ${obnizNetworks.length - 1}, or if all, input a`));
  //             }
  //           }
  //         },
  //       );
  //     }
  //   });
  // }
}
