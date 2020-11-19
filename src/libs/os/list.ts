import chalk from "chalk"
import Defaults from "../../defaults";
import OS from "../obnizio/os";
import * as Storage from "../storage";

export default {
  help: `List available OS list for hardware.

-h --hardware   hardware identifier. Default to ${Defaults.HARDWARE}
  `,
  async execute(args: any) {
    let hardware: any = args.h || args.hardware;
    if (!hardware) {
      hardware = Defaults.HARDWARE;
      await listHardwares();

    }
    await listForHardware(hardware);
  },
};

async function listHardwares() {
  console.log(`
Available Hardwares on obnizCloud
`);
  const hardwares = await OS.hardwares();
  for (const h of hardwares) {
    console.log(`  ${h.hardware}`);
  }
}

async function listForHardware(hardware: string) {
  console.log(`
Versions for hardware=${chalk.green(hardware)}
`);
  const versions = await OS.list(hardware);
  for (const v of versions) {
    console.log(`  ${v.version}`);
  }
}
