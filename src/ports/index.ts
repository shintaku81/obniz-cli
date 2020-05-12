import SerialPort from "serialport";

export default async () => {
  const ports: SerialPort.PortInfo[] = await SerialPort.list();
  console.log(`===Found Serial Ports===`);

  for (const port of ports) {
    console.log(`${port.path}`);
  }
};
