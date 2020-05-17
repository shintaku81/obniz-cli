import chalk from "chalk";
import SerialPort from "serialport";
import KeyPairGen from "../keypair";

const baudRate = 115200;

export default class Serial {
  public portname: string;
  public stdout: any;
  public onerror: any;
  public serialport: SerialPort;

  public totalReceived = "";

  private _recvCallback: any;

  constructor(obj: { portname: string; stdout: any; onerror: any }) {
    this.portname = obj.portname;
    this.stdout = obj.stdout;
    this.onerror = obj.onerror;
  }

  public async open() {
    return new Promise(async (resolve, reject) => {
      this.serialport = new SerialPort(this.portname, { baudRate });

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

  public async close() {
    return new Promise((resolve, reject) => {
      this.serialport.close(() => {
        resolve();
      });
    });
  }

  public clearReceived() {
    this.totalReceived = "";
  }

  /**
   *
   */
  public async reset() {
    await new Promise(async (resolve, reject) => {
      this.serialport.set(
        {
          dtr: false,
        },
        (e) => {
          if (e) {
            reject(e);
            return;
          }
          resolve();
        },
      );
    });
    await new Promise((resolve, reject) => {
      setTimeout(resolve, 10);
    });
    await new Promise(async (resolve, reject) => {
      // リセット時にはクリアする
      this.clearReceived();
      this.serialport.set(
        {
          dtr: true,
        },
        (e) => {
          if (e) {
            reject(e);
            return;
          }
          resolve();
        },
      );
    });
  }


  public async waitFor(key: string, timeout: number | undefined = 20 * 1000) {
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
  public async waitForSettingMode() {
    return new Promise(async (resolve, reject) => {
      let timeoutTimer = setTimeout(() => {
        console.log(
          chalk.yellow(`
***
Could you reset your device? Can you press reset button?
***
`),
        );
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
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * Sending a text
   * @param text
   */
  public send(text: string) {
    try {
      this.serialport.write(`${text}`);
      this.totalReceived = "";
    } catch (e) {
      this.stdout("" + e);
    }
  }

  /**
   * Setting a Devicekey.
   * @param devicekey
   */
  public async setDeviceKey(devicekey: string) {
    const obnizid = devicekey.split("&")[0];
    console.log(
      chalk.yellow(`
***
Setting DeviceKey ${devicekey}

obniz-cli will make your device bootload mode by using RTS.
If your device need manual operation to enter bootload mode, Do now and reset your device.
***
    `),
    );
    await this.reset(); // force print DeviceKey
    this.send(`\n`);
    await new Promise((resolve, reject) => {
      setTimeout(resolve, 3 * 1000);
    });
    if (this.totalReceived.indexOf(`obniz id: `) >= 0) {
      if (this.totalReceived.indexOf(`obniz id: ${obnizid}`) >= 0) {
        console.log(
          chalk.yellow(`
***
This device already configured Device as obnizID ${obnizid}
***
            `),
        );
      } else {
        console.log(
          chalk.red(`
***

This device already has DeviceKey.
And your argmented DeviceKey does not match to device one.
I will ignore artumented DeviceKey now.
if you want to flash DeviceKey to this device. Please call

obniz-cli os:erase

***
    `),
        );
      }
      return;
    }
    await this.waitFor("DeviceKey", 60 * 1000);
    this.send(`${devicekey}\n`);
    this.clearReceived();
    await this.waitFor(`obniz id: ${obnizid}`, 10 * 1000);
  }

  /**
   * Reset All Network Setting
   */
  public async resetWiFiSetting() {
    console.log(`
***
Resetting All Network Setting
***
    `);
    await this.waitForSettingMode();
    await this.waitFor("Input char >>", 10 * 1000);
    this.send(`s`);
    await this.waitFor("-----Select Setting-----", 10 * 1000);
    await this.waitFor("Input number >>", 10 * 1000);
    this.clearReceived();
    this.send(`3`); // Reset All
    await this.waitFor("-----Wireless LAN Reset-----", 10 * 1000);
    await this.waitFor("Input char >>", 10 * 1000);
    this.send(`y`); // yes to reset
    this.clearReceived();
    await this.waitFor("Rebooting", 10 * 1000);
  }

    /**
   * Reset All Network Setting
   */
  public async resetAllSetting() {
    console.log(`
***
Resetting All Network Setting
***
    `);
    await this.waitForSettingMode();
    await this.waitFor("Input char >>", 10 * 1000);
    this.send(`s`);
    await this.waitFor("-----Select Setting-----", 10 * 1000);
    await this.waitFor("Input number >>", 10 * 1000);
    this.clearReceived();
    this.send(`2`); // Reset All
    await this.waitFor("-----All Reset", 10 * 1000);
    await this.waitFor("Input char >>", 10 * 1000);
    this.send(`y`); // yes to reset
    this.clearReceived();
    await this.waitFor("Rebooting", 10 * 1000);
  }

  /**
   * Setting Network Type.
   * @param type
   */
  public async setNetworkType(type: "wifi" | "ethernet" | "cellular") {
    console.log(`
***
Setting Network
***
    `);
    await this.waitForSettingMode();
    await this.waitFor("Input char >>", 10 * 1000);
    this.send(`s`);
    await this.waitFor("-----Select Setting-----", 10 * 1000);
    await this.waitFor("Input number >>", 10 * 1000);
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
  public async setWiFi(setting: any) {
    console.log(
      chalk.yellow(`
***
Setting Network
***
    `),
    );
    await this.waitFor("--- Select SSID Number ---", 30 * 1000);
    await this.waitFor("Input number >>", 10 * 1000);
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
    await this.waitFor("--- Hidden SSID ---", 10 * 1000);
    await this.waitFor("Input number >>", 10 * 1000);
    if (setting.hidden) {
      this.send(`1`);
    } else {
      this.send(`0`);
    }
    this.clearReceived();

    // SSID
    await this.waitFor("--- SSID ---", 10 * 1000);
    await this.waitFor("Input text >>", 10 * 1000);
    this.send(`${setting.ssid}\n`);
    this.clearReceived();

    // Password
    await this.waitFor("--- Password ---", 10 * 1000);
    await this.waitFor("Input text >>", 10 * 1000);
    this.send(`${setting.password}\n`);
    this.clearReceived();

    // DHCP
    await this.waitFor("--- select Network ---", 10 * 1000);
    await this.waitFor("Input number >>", 10 * 1000);
    if (setting.dhcp === false) {
      this.send(`1`);
      this.clearReceived();

      await this.waitFor("--- IP Address ---", 10 * 1000);
      await this.waitFor("Input address >>", 10 * 1000);
      this.send(`${setting.static_ip}\n`);
      this.clearReceived();

      await this.waitFor("--- Default Gateway ---", 10 * 1000);
      await this.waitFor("Input address >>", 10 * 1000);
      this.send(`${setting.default_gateway}\n`);
      this.clearReceived();

      await this.waitFor("--- Subnet Mask ---", 10 * 1000);
      await this.waitFor("Input address >>", 10 * 1000);
      this.send(`${setting.subnetmask}\n`);
      this.clearReceived();

      await this.waitFor("--- DNS Address ---", 10 * 1000);
      await this.waitFor("Input address >>", 10 * 1000);
      this.send(`${setting.dns}\n`);
      this.clearReceived();
    } else {
      this.send(`0`);
      this.clearReceived();
    }

    // PROXY
    await this.waitFor("--- Proxy Setting ---", 10 * 1000);
    await this.waitFor("Input number >>", 10 * 1000);
    if (setting.proxy) {
      this.send(`1`);
      this.clearReceived();

      await this.waitFor("--- Proxy Config ---", 10 * 1000);
      await this.waitFor("Input text >>", 10 * 1000);
      this.send(`${setting.proxy_address}\n`);
      this.clearReceived();

      await this.waitFor("--- Proxy Port ---", 10 * 1000);
      await this.waitFor("Input number >>", 10 * 1000);
      this.send(`${setting.proxy_port}\n`);
      this.clearReceived();
    } else {
      this.send(`0`);
      this.clearReceived();
    }
    await this.waitFor("Wi-Fi Connecting SSID", 10 * 1000);

    console.log(
      chalk.green(`
***
Configration Successfull`),
    );
    console.log(chalk.green(JSON.stringify(setting, null, 2)));
    console.log(
      chalk.green(`***
`),
    );
  }

  private _searchLine(text: string): string | null {
    for (const line of this.totalReceived.split("\n")) {
      if (line.indexOf(text) >= 0) {
        return line;
      }
    }
    return null;
  }
}
