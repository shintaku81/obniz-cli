import SerialPort from "serialport";

export default async () => {
  const ports: SerialPort.PortInfo[] = await SerialPort.list();
  console.log(`===Found Serial Ports===`);

  for (let i = 0; i < ports.length; i++) {
    console.log(`${i}: ${ports[i].path}`);
  }

  return ports;
};
