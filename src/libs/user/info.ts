import Login from "../obnizio/login";
import User from "../obnizio/user";
import * as Storage from "../storage";

export default async () => {
  const token = Storage.get("token");
  if (!token) {
    console.log(`Not Sign In`);
    return;
  }
  console.log(`Contacting to obniz Cloud...`);
  const user = await User(token);
  if (!user) {
    console.log(`Authentication Failed.`);
    return;
  }
  console.log(`Signin In User`);
  console.log(` name : ${user.name}`);
  console.log(` email: ${user.email}`);
};
