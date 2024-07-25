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
import { DebugLogger } from "../logger/debugLogger.js";

interface PartitionData {
  name: string;
  offset: number;
  bin: Buffer;
}

export const FlashSteps = [
  { name: "DOWNLOAD_FILES", raito: 10 },
  { name: "CONNECT", raito: 10 },
  { name: "PREPARE_FLASH", raito: 10 },
  { name: "FLASH_BOOTLOADER", raito: 10 },
  { name: "FLASH_APP", raito: 100 },
  { name: "FLASH_PARTITION", raito: 10 },
  { name: "AFTER_FLASH", raito: 10 },
] as const satisfies { name: string; raito: number }[];

export type FlashStepName = (typeof FlashSteps)[number]["name"];
const totalRaito = FlashSteps.reduce((acc, cur) => acc + cur.raito, 0);

export async function flash(
  port: SerialPortSelect,
  os: ObnizOsSelect,
  proceed?: (args: {
    percentage: number;
    step: FlashStepName;
    stepPercentage: number;
  }) => void,
) {
  const logger = getLogger();
  const stepLogger = logger.step("Flashing obnizOS");

  proceed?.(calcProceed("DOWNLOAD_FILES", 0));
  stepLogger.updateStatus(
    `preparing file for hardware=${chalk.green(os.hardware)} version=${chalk.green(os.version)}`,
  );

  // prepare files
  const files = await OS.prepareLocalFile(os);
  proceed?.(calcProceed("DOWNLOAD_FILES", 100));

  proceed?.(calcProceed("CONNECT", 0));
  stepLogger.updateStatus(`Opening Serial Port ${chalk.green(port.portname)}`);
  const device = await serial.findPort(port.portname);
  if (!device) {
    throw new Error("Device not found");
  }
  await device.open({ baudRate: ESP_ROM_BAUD });
  const debugLogger = new DebugLogger(logger);
  const esploader = new ESPLoader(device, debugLogger);
  proceed?.(calcProceed("CONNECT", 100));

  try {
    proceed?.(calcProceed("PREPARE_FLASH", 0));
    // esploader.debug = true;
    await esploader.initialize();

    logger.debug(
      "MAC Address: " + Buffer.from(esploader.macAddr()).toString("hex"),
    );

    stepLogger.updateStatus(`Connected. Flashing...`);
    const espStub = await esploader.runStub();
    // espStub.debug = true;
    await espStub.setBaudrate(port.baud);
    const appFileBuffer = await fs.readFile(files.app_path);
    const bootloaderFileBuffer = await fs.readFile(files.bootloader_path);
    const partitionFileBuffer = await fs.readFile(files.partition_path);

    proceed?.(calcProceed("PREPARE_FLASH", 100));
    const partitions: (PartitionData & { stepName: FlashStepName })[] = [
      {
        name: "bootloader",
        offset: 0x1000,
        bin: bootloaderFileBuffer,
        stepName: "FLASH_BOOTLOADER",
      },
      {
        name: "app",
        offset: 0x10000,
        bin: appFileBuffer,
        stepName: "FLASH_APP",
      },
      {
        name: "partition",
        offset: 0x8000,
        bin: partitionFileBuffer,
        stepName: "FLASH_PARTITION",
      },
    ];

    for (const partition of partitions) {
      stepLogger.updateStatus(`${partition.name} writing...`);
      await espStub.flashData(
        partition.bin,
        (bytesWritten, totalBytes) => {
          proceed?.(
            calcProceed(partition.stepName, (bytesWritten / totalBytes) * 100),
          );
          stepLogger.updateStatus(
            `${partition.name} writing... ` +
              Math.floor((bytesWritten / totalBytes) * 100) +
              "%",
          );
        },
        partition.offset,
        true,
      );
      await wait(100);
    }

    proceed?.(calcProceed("AFTER_FLASH", 100));
    stepLogger.finish("Flashed");
  } catch (e) {
    stepLogger.failed(`Fail`);
    logger.error(e);
  } finally {
    logger.debug("disconnecting");
    await esploader.disconnect();
    await device.close();
    logger.debug("disconnected");
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

function calcProceed(stepName: FlashStepName, percentage: number) {
  const stepIndex = FlashSteps.findIndex((s) => s.name === stepName);
  const step = FlashSteps[stepIndex];
  const current = FlashSteps.slice(0, stepIndex).reduce(
    (acc, cur) => acc + cur.raito,
    0,
  );
  return {
    percentage: (current + (percentage / 100) * step.raito) / totalRaito,
    step: stepName,
    stepPercentage: percentage,
  };
}
