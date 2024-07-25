import chalk from "chalk";
import { DefaultParams } from "../../defaults.js";
import OS from "../../libs/obnizio/os.js";
import { Command } from "../arg.js";

export const ListCommand = {
  help: `List available OS list for hardware.

-h --hardware   hardware identifier. Default to ${DefaultParams.HARDWARE}
  `,
  async execute(args: { h?: string; hardware?: string }) {
    let hardware = args.h || args.hardware;
    if (!hardware) {
      hardware = DefaultParams.HARDWARE;
      await listHardwares();
    }
    await listForHardware(hardware);
  },
} as const satisfies Command;

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
