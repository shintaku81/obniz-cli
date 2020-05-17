import chalk from "chalk";
import child_process from "child_process";
import OS from "../obnizio/os";

export default function flash(obj: { portname: string; hardware: string; version: string; baud: number; stdout: any }) {
  return new Promise(async (resolve, reject) => {
    // prepare files
    const files = await OS.prepareLocalFile(obj.hardware, obj.version);

    let received = "";
    obj.stdout("", { clear: true });

    console.log(
      chalk.yellow(`
***
flashing obnizOS
 serialport: ${obj.portname}
 baud: ${obj.baud}

 hardware: ${obj.hardware}
 version: ${obj.version}
***
`),
    );

    const cmd =
      `esptool.py --chip esp32 --port ${obj.portname} --baud ${obj.baud} --before default_reset --after hard_reset` +
      ` write_flash` +
      ` -z --flash_mode dio --flash_freq 40m --flash_size detect` +
      ` 0x1000 ${files.bootloader_path}` +
      ` 0x10000 ${files.app_path}` +
      ` 0x8000 ${files.partition_path}`;

    const child = child_process.exec(cmd);
    child.stdout.setEncoding("utf8");
    child.stdout.on("data", (text) => {
      obj.stdout(text);
      received += text;
    });
    child.stderr.on("data", (text) => {
      obj.stdout(text);
      received += text;
    });
    child.on("error", (er) => {
      console.log(er);
      reject(er);
    });
    child.on("exit", (code) => {
      try {
        throwIfFailed(received);
      } catch (e) {
        reject(e);
        return;
      }
      if (code !== 0) {
        reject(new Error(`Failed Flashing.`));
        return;
      }

      resolve();
    });
  });
}

function throwIfFailed(text: string) {
  if (text.indexOf("Leaving...") >= 0) {
    // success
    return;
  }
  if (text.indexOf("Timed out waiting for packet header") >= 0) {
    throw new Error(`No Bootload mode ESP32 found. Check connection or Boot Mode.`);
  }
  throw new Error(`Failed Flashing.`);
}
