import SerialPort from "serialport";

export default async () => {
  const ports: SerialPort.PortInfo[] = await SerialPort.list();
  console.log(`===Founded Serial Ports===`);

  for (let i = 0; i < ports.length; i++) {
    const port = ports[i]
    console.log(`${port.path}${ port.manufacturer ? ` (${port.manufacturer})` : `` }`);
  }

  return ports;
};
