import { serial } from "@9wick/node-web-serial-ponyfill";
import {
  ESPLoader,
  ESP_ROM_BAUD,
} from "@9wick/adafruit-webserial-esptool/dist/index.js";
import { getLogger } from "../../libs/logger/index.js";

export const EraseCommand = async (obj: {
  portname: string;
  baud: number;
  stdout: any;
}) => {
  console.log("Erasing...");
  const logger = getLogger();

  const device = await serial.findPort(obj.portname);
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
    // await espStub.setBaudrate(obj.baud);
    await espStub.eraseFlash();
    logger.log("finished erasing");
  } finally {
    await esploader.disconnect();
  }
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
