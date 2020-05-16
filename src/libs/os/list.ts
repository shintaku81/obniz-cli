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
    }
    await list(hardware);
  },
};

async function list(hardware: string) {
  const token = Storage.get("token");
  console.log(`
OS versions for ${hardware}
`);
  const versions = await OS.list(hardware, token);
  for (const v of versions) {
    console.log(`  ${v.version}`);
  }
}
