import { serial } from "@9wick/node-web-serial-ponyfill";
import { ESP_ROM_BAUD } from "@9wick/adafruit-webserial-esptool/dist/index.js";
import { getLogger } from "../../libs/logger/index.js";
import { SerialPortSelect } from "../../types.js";

export const LogCommand = async (port: SerialPortSelect) => {
  const logger = getLogger();

  const device = await serial.findPort(port.portname);
  if (!device) {
    throw new Error("Device not found");
  }

  await device.open({
    baudRate: ESP_ROM_BAUD,
    dataBits: 8,
    stopBits: 1,
    parity: "none",
  });
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
    } finally {
      reader.releaseLock();
      await device.close();
    }
  }
};
