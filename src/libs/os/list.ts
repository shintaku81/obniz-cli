import OS from '../obnizio/os'
import * as Storage from '../storage'

export default async (hardware: string) => {
  const token = Storage.get('token');
  console.log(`
OS versions for ${hardware}
`)
  const versions = await OS.list(hardware, token);
  for(const v of versions) {
    console.log(`  ${v.version}`);
  }
}