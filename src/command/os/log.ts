import { serial } from "@9wick/node-web-serial-ponyfill";
import {
  ESPLoader,
  ESP_ROM_BAUD,
} from "@9wick/adafruit-webserial-esptool/dist/index.js";
import { getLogger } from "../../libs/logger/index.js";
import { WritableStream } from "web-streams-polyfill";

export const LogCommand = async (obj: {
  portname: string;
  baud: number;
  stdout: any;
}) => {
  const logger = getLogger();

  const device = await serial.findPort(obj.portname);
  if (!device) {
    throw new Error("Device not found");
  }

  await device.open({ baudRate: ESP_ROM_BAUD });
  if (device.readable) {
    const reader = device.readable.getReader();
    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          break;
        }
        logger.log(Buffer.from(value).toString("ascii"));
      }
    } catch (error) {
      // |error| を処理する
    } finally {
      reader.releaseLock();
    }
  }
  await device.close();
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
