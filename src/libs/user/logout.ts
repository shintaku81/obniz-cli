import * as Storage from '../storage'

export default async () => {
  Storage.set('token', null);
  console.log(`Logged out`);
}