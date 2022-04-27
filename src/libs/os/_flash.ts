import { EspLoader } from "@9wick/esptool.js";
import { EsptoolSerial } from "@9wick/esptool.js/build/node/serial";
import { sleep } from "@9wick/esptool.js/build/util";
import chalk from "chalk";
import child_process from "child_process";
import { promises as fs } from "fs";

import { getOra } from "../ora-console/getora";
const ora = getOra();

import OS from "../obnizio/os";

export default async function flash(obj: {
  portname: string;
  hardware: string;
  version: string;
  baud: number;
  debugserial: any;
  stdout: any;
}) {
  const spinner = ora(
    `Flashing obnizOS: preparing file for hardware=${chalk.green(obj.hardware)} version=${chalk.green(obj.version)}`,
  ).start();
  if (obj.debugserial) {
    spinner.stop();
  }

  let port: EsptoolSerial | null = null;
  let espTool: EspLoader | null = null;

  try {
    // prepare files
    const files = await OS.prepareLocalFile(obj.hardware, obj.version, (progress: string) => {
      spinner.text = `Flashing obnizOS: ${progress}`;
    });

    spinner.text = `Flashing obnizOS: Opening Serial Port ${chalk.green(obj.portname)}`;

    port = new EsptoolSerial(obj.portname, {
      baudRate: 115200,
      autoOpen: false,
    });
    await port.open();

    espTool = new EspLoader(port, {
      logger: {
        log(message?: unknown, ...optionalParams) {},
        debug(message?: unknown, ...optionalParams) {},
        error(message?: unknown, ...optionalParams) {},
      },
    });

    await espTool.connect();

    const chipName = await espTool.chipName();
    const macAddr = await espTool.macAddr();
    // console.log("chipName", chipName);
    // console.log("macAddr", macAddr);
    await espTool.loadStub();

    if (obj.baud) {
      await espTool.setBaudRate(115200, obj.baud);
    }

    const [bootloaderBin, partitionBin, appBin] = await Promise.all([
      fs.readFile(files.bootloader_path),
      fs.readFile(files.partition_path),
      fs.readFile(files.app_path),
    ]);

    const partitions = [
      {
        name: "bootloader",
        data: bootloaderBin,
        offset: 0x1000,
      },
      {
        name: "partition",
        data: partitionBin,
        offset: 0x8000,
      },
      {
        name: "app",
        data: appBin,
        offset: 0x10000,
      },
    ];

    for (let i = 0; i < partitions.length; i++) {
      await espTool.flashData(partitions[i].data, partitions[i].offset, (idx, cnt) => {
        spinner.text = `Flashing obnizOS: writing ${partitions[i].name} ${Math.floor((idx / cnt) * 100)}%...`;
      });
      await sleep(100);
    }
    // console.log("successfully written device partitions");
    // console.log("flashing succeeded");

    spinner.succeed(`Flashing obnizOS: Flashed`);
  } catch (e) {
    spinner.fail(`Flashing obnizOS: Fail`);
    throw e;
  } finally {
    try {
      if (espTool) {
        await espTool.disconnect();
      }
      if (port) {
        port.close();
      }
    } catch (e) {
      // nothing
    }
  }
}
