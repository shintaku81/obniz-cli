import { SerialPort } from "serialport";
import { SerialPortInfo } from "../../types.js";

export const PortsCommand = async (): Promise<SerialPortInfo[]> => {
  const ports = await SerialPort.list();
  console.log(`===Founded Serial Ports===`);

  for (let i = 0; i < ports.length; i++) {
    const port = ports[i];
    console.log(
      `${port.path}${port.manufacturer ? ` (${port.manufacturer})` : ``}`,
    );
  }

  return ports;
};
