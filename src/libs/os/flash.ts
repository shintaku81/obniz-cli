import chalk from "chalk";
import { promises as fs } from "fs";

import { getOra } from "../ora-console/getora.js";

const ora = getOra();

import OS from "../obnizio/os.js";
import { serial } from "@9wick/node-web-serial-ponyfill";
import { ESP_ROM_BAUD, ESPLoader } from "@9wick/adafruit-webserial-esptool";
import { getLogger } from "../logger/index.js";
import { wait } from "../wait.js";
import { ObnizOsSelect, SerialPortSelect } from "../../types.js";

interface PartitionData {
  name: string;
  offset: number;
  bin: Buffer;
}

export async function flash(port: SerialPortSelect, os: ObnizOsSelect) {
  const logger = getLogger();

  logger.log(
    `Flashing obnizOS: preparing file for hardware=${chalk.green(os.hardware)} version=${chalk.green(os.version)}`,
  );

  // prepare files
  const files = await OS.prepareLocalFile(os);

  const device = await serial.findPort(port.portname);
  if (!device) {
    throw new Error("Device not found");
  }

  logger.log(
    `Flashing obnizOS: Opening Serial Port ${chalk.green(port.portname)}`,
  );
  await device.open({ baudRate: ESP_ROM_BAUD });
  const esploader = new ESPLoader(device, logger);

  try {
    // esploader.debug = true;
    await esploader.initialize();

    logger.log("Connected to " + esploader.chipName);
    logger.log(
      "MAC Address: " + Buffer.from(esploader.macAddr()).toString("hex"),
    );

    logger.log(`Flashing obnizOS: Connected. Flashing...`);
    const espStub = await esploader.runStub();
    // espStub.debug = true;
    await espStub.setBaudrate(port.baud);
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
  } catch (e) {
    logger.error(`Flashing obnizOS: Fail`);
    logger.error(e);
  } finally {
    logger.log("disconnecting");
    await esploader.disconnect();
    await device.close();
    logger.log("disconnected");
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
}

// function throwIfFailed(text: string) {
//   if (text.indexOf("Leaving...") >= 0) {
//     // success
//     return;
//   }
//   let err;
//   if (text.indexOf("Timed out waiting for packet header") >= 0) {
//     err = new Error(
//       `No Bootload mode ESP32 found. Check connection or Boot Mode.`,
//     );
//   } else {
//     err = new Error(`Failed Flashing.`);
//   }
//   console.log(text);
//   throw err;
// }
