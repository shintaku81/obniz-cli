import { serial } from "@9wick/node-web-serial-ponyfill";
import {
  ESP_ROM_BAUD,
  ESPLoader,
} from "@9wick/adafruit-webserial-esptool/dist/index.js";
import { getLogger } from "../logger/index.js";
import { SerialPortSelect } from "../../types.js";

export const erase = async (port: SerialPortSelect) => {
  const logger = getLogger();

  const device = await serial.findPort(port.portname);
  if (!device) {
    throw new Error("Device not found");
  }
  await device.open({ baudRate: ESP_ROM_BAUD });
  const esploader = new ESPLoader(device, logger);
  try {
    // esploader.debug = true;
    await esploader.initialize();

    logger.log("Connected to " + esploader.chipName);
    logger.log(
      "MAC Address: " + Buffer.from(esploader.macAddr()).toString("hex"),
    );
    const espStub = await esploader.runStub();
    await espStub.setBaudrate(port.baud);
    await espStub.eraseFlash();
    logger.log("Finished erasing");
  } finally {
    logger.log("Disconnecting...");
    await esploader.disconnect();
    await device.close();
    logger.log("Disconnected");
  }
};
