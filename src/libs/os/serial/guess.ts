import SerialPort from "serialport";

export default async () => {
  let portname;
  const availablePorts = await findUsbSerials();
  if (availablePorts.length === 0) {
    // not found
  } else if (availablePorts.length === 1) {
    portname = availablePorts[0];
  } else if (availablePorts.length > 1) {
    console.error("multiple usbserial found");
    for (let i = 0; i < availablePorts.length; i++) {
      console.log(" - " + availablePorts[i] + ` ${i === 0 ? "CHOOSED" : ""}`);
    }
    portname = availablePorts[0];
  }
  return portname;
};

async function findUsbSerials(): Promise<string[]> {
  const availablePorts: string[] = [];
  const ports: SerialPort.PortInfo[] = await SerialPort.list();
  for (const port of ports) {
    if (port.path.indexOf("tty.SLAB") >= 0) {
      availablePorts.push(port.path);
      break;
    } else if (port.path.indexOf("ttyUSB") >= 0) {
      availablePorts.push(port.path);
      break;
    } else if (port.path.indexOf("usbserial") >= 0) {
      availablePorts.push(port.path);
      break;
    }
  }
  return availablePorts;
}
