import Serial from "../serial";

export default async (obj: { portname: string; stdout: any; configs: any }) => {
  // Return if no configs required
  if (!obj.configs) {
    return;
  }

  // Open aport
  const serial = new Serial({
    portname: obj.portname,
    stdout: obj.stdout,
    onerror: (err) => {
      throw new Error(`${err}`);
    },
  });
  await serial.open();

  // config devicekey
  if (obj.configs.devicekey) {
    await serial.setDeviceKey(obj.configs.devicekey);
  }

  // close serial
  await serial.close();
};
