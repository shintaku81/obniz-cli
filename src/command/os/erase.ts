import child_process from "child_process";
import { ESPLoader, Transport } from "@9wick/esptool-js";

export const EraseCommand = async (obj: {
  portname: string;
  baud: number;
  stdout: any;
}) => {
  const device = await navigator.serial.requestPort();
  const transport = new Transport(device, true);

  try {
    const flashOptions = {
      transport,
      baudrate: obj.baud,
      romBaudrate: 115200,
    };
    const esploader = new ESPLoader(flashOptions);

    const chip = await esploader.main();
    console.log({ chip });

    // Temporarily broken
    // await esploader.flashId();
  } catch (e) {
    console.error(e);
  }
};
