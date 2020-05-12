import SerialPort from "serialport";
import KeyPairGen from "../keypair";

const baudRate = 115200;

export default async (obj: { portname: string; stdout: any; configs: any }) => {
  return new Promise(async (resolve, reject) => {
    let timeoutTimer = setTimeout(() => {
      reject(new Error("Timeout"));
    }, 20 * 1000);

    const serialport = new SerialPort(obj.portname, { baudRate });

    serialport.on("open", () => {
      // open logic
      serialport.set({ rts: false, dtr: false });
      let total = "";
      let obnizid;
      console.log(`serial open ${obj.portname}`);
      serialport.on("readable", async () => {
        const received = serialport.read().toString("utf-8");
        total += received;
        obj.stdout(received);
        if (total.indexOf("DeviceKey") >= 0) {
          if (obj.configs.devicekey) {
            let devicekey;
            if (typeof obj.configs.devicekey === "string") {
              devicekey = obj.configs.devicekey;
            } else {
              const keypair = KeyPairGen();
              devicekey = `${obnizid}&${keypair.privkey}`;
            }
            try {
              serialport.write(`${devicekey}\n`);
              total = "";
              obnizid = devicekey.split("&")[0];
            } catch (e) {
              obj.stdout("" + e);
            }
          }
        }
        if (total.indexOf(`obniz id: ${obnizid}`) >= 0) {
          // written.
          // obnizid = await ObnizApi.registrate(hwIdentifier, keypair.pubkey);
          serialport.close(() => {
            if (timeoutTimer) {
              clearTimeout(timeoutTimer);
              timeoutTimer = null;
            }
            if (obnizid) {
              resolve(obnizid);
            } else {
              reject("already exist obniz id!!!");
            }
          });
        }
      });

      // force print DeviceKey
      serialport.write(`\n`);
    });

    serialport.on("error", (err) => {
      reject(err);
    });
  });
};
