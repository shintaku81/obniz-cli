import chalk from "chalk";
import child_process from "child_process";
import { promises as fs } from "fs";

import { getOra } from "../ora-console/getora.js";

const ora = getOra();

import OS from "../obnizio/os.js";
import { serial } from "@9wick/node-web-serial-ponyfill";
import { ESP_ROM_BAUD, ESPLoader } from "@9wick/adafruit-webserial-esptool";
import { getLogger } from "../logger/index.js";
import { wait } from "../wait.js";

interface PartitionData {
  name: string;
  offset: number;
  bin: Buffer;
}

export default function flash(obj: {
  portname: string;
  hardware: string;
  version: string;
  baud: number;
  debugserial: any;
  stdout: any;
}) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise<void>(async (resolve, reject) => {
    const logger = getLogger();
    const status = "connecting";

    const spinner = ora(
      `Flashing obnizOS: preparing file for hardware=${chalk.green(obj.hardware)} version=${chalk.green(obj.version)}`,
    ).start();
    spinner.stop();

    // prepare files
    const files = await OS.prepareLocalFile(
      obj.hardware,
      obj.version,
      (progress: string) => {
        spinner.text = `Flashing obnizOS: ${progress}`;
      },
    );

    const received = "";

    const device = await serial.findPort(obj.portname);
    if (!device) {
      throw new Error("Device not found");
    }

    spinner.text = `Flashing obnizOS: Opening Serial Port ${chalk.green(obj.portname)}`;
    await device.open({ baudRate: ESP_ROM_BAUD });
    const esploader = new ESPLoader(device, logger);

    try {
      // esploader.debug = true;
      await esploader.initialize();

      logger.log("Connected to " + esploader.chipName);
      logger.log(
        "MAC Address: " + Buffer.from(esploader.macAddr()).toString("hex"),
      );

      spinner.text = `Flashing obnizOS: Connected. Flashing...`;
      const espStub = await esploader.runStub();
      // espStub.debug = true;
      await espStub.setBaudrate(obj.baud);
      const appFileBuffer = await fs.readFile(files.app_path);
      const bootloaderFileBuffer = await fs.readFile(files.bootloader_path);
      const partitionFileBuffer = await fs.readFile(files.partition_path);

      const partitions: PartitionData[] = [
        {
          name: "bootloader",
          offset: 0x1000,
          bin: bootloaderFileBuffer,
        },
        {
          name: "app",
          offset: 0x10000,
          bin: appFileBuffer,
        },
        {
          name: "partition",
          offset: 0x8000,
          bin: partitionFileBuffer,
        },
      ];

      for (const partition of partitions) {
        logger.log(`${partition.name} writing...`);
        await espStub.flashData(
          partition.bin,
          (bytesWritten, totalBytes) => {
            logger.log(
              `${partition.name} : ` +
                Math.floor((bytesWritten / totalBytes) * 100) +
                "%",
            );
          },
          partition.offset,
          true,
        );
        await wait(100);
      }

      logger.log("Flashing obnizOS: Flashed");
      spinner.succeed(`Flashing obnizOS: Flashed`);
    } catch (e) {
      console.error(e);
      spinner.fail(`Flashing obnizOS: Fail`);
    } finally {
      console.log("disconnecting");
      await esploader.disconnect();
      await device.close();
      console.log("disconnected");
    }
    //
    // const cmd =
    //   `esptool.py --chip auto --port "${obj.portname}" --baud ${obj.baud} --before default_reset --after hard_reset` +
    //   ` write_flash` +
    //   ` -z --flash_mode dio --flash_freq 40m --flash_size detect` +
    //   ` 0x1000 "${files.bootloader_path}"` +
    //   ` 0x10000 "${files.app_path}"` +
    //   ` 0x8000 "${files.partition_path}"`;
    //
    // const onSuccess = () => {
    //   spinner.succeed(`Flashing obnizOS: Flashed`);
    //   resolve();
    // };
    // const onFailed = (err: any) => {
    //   spinner.fail(`Flashing obnizOS: Fail`);
    //   reject(err);
    // };
    //
    //
    // const child = child_process.exec(cmd);
    // child.stdout?.setEncoding("utf8");
    // child.stdout?.on("data", (text) => {
    //   // console.log(text);
    //   if (obj.debugserial) {
    //     console.log(text);
    //     obj.stdout(text);
    //   }
    //   received += text;
    //
    //   if (status === "connecting" && received.indexOf(`Chip is`) >= 0) {
    //     status = "flashing";
    //     spinner.text = `Flashing obnizOS: Connected. Flashing...`;
    //   }
    // });
    // child.stderr?.on("data", (text) => {
    //   if (obj.debugserial) {
    //     obj.stdout(text);
    //   }
    //   received += `${chalk.red(text)}`;
    // });
    // child.on("error", (er) => {
    //   onFailed(er);
    // });
    // child.on("exit", (code) => {
    //   try {
    //     throwIfFailed(received);
    //   } catch (e) {
    //     onFailed(e);
    //     return;
    //   }
    //   if (code !== 0) {
    //     reject(new Error(`Failed Flashing.`));
    //     return;
    //   }
    //   onSuccess();
    // });
  });
}

function throwIfFailed(text: string) {
  if (text.indexOf("Leaving...") >= 0) {
    // success
    return;
  }
  let err;
  if (text.indexOf("Timed out waiting for packet header") >= 0) {
    err = new Error(
      `No Bootload mode ESP32 found. Check connection or Boot Mode.`,
    );
  } else {
    err = new Error(`Failed Flashing.`);
  }
  console.log(text);
  throw err;
}
