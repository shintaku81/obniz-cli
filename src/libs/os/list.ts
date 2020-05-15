import OSList from '../obnizio/oslist'
import * as Storage from '../storage'

export default async (hardware: string) => {
  const token = Storage.get('token');
  console.log(`
OS versions for ${hardware}
`)
  const versions = await OSList(hardware, token);
  for(const v of versions) {
    console.log(`  ${v.version}`);
  }
}