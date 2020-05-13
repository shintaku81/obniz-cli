import Login from '../obnizio/login'
import User from '../obnizio/user'
import * as Storage from '../storage'

export default async () => {
  const token = await Login();
  const user = await User(token);
  Storage.set('token', token);
  console.log(`Logged in as "${user.email}"`);
}