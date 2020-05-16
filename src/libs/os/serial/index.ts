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
   * @param key
   * @param timeout
   */
  public async waitFor(key: string, timeout: number | undefined = 20 * 1000) {
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
