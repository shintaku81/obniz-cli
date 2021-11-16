import { EspLoader } from "@9wick/esptool.js";
import { EsptoolSerial } from "@9wick/esptool.js/build/node/serial";
import child_process from "child_process";

export default async (obj: { portname: string; baud: number; stdout: any }) => {
  obj.stdout("", { clear: true });

  const port = new EsptoolSerial(obj.portname, {
    baudRate: 115200,
    autoOpen: false,
  });
  await port.open();

  const espTool = new EspLoader(port, {
    debug: false,
    logger: {
      log(message?: unknown, ...optionalParams) {},
      debug(message?: unknown, ...optionalParams) {},
      error(message?: unknown, ...optionalParams) {},
    },
  });

  await espTool.connect();

  const chipName = await espTool.chipName();
  const macAddr = await espTool.macAddr();
  console.log("chipName", chipName);
  console.log("macAddr", macAddr);
  await espTool.loadStub();
  await espTool.setBaudRate(115200, obj.baud);

  console.log("Start erase");
  await espTool.eraseFlash();
  console.log("Chip erase completed successfully");
  await espTool.disconnect();
};
