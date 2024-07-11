import User from "../../libs/obnizio/user.js";
import * as Storage from "../../libs/storage.js";

export const UserInfoCommand = async () => {
  const token = Storage.get("token");
  if (!token) {
    console.log(`Not Sign In`);
    return;
  }
  console.log(`Contacting to obniz Cloud...`);

  const user = await User(token).catch(() => null);
  if (!user) {
    console.log(`Authentication Failed.`);
    return;
  }
  console.log(`Signin In User`);
  console.log(` name : ${user.name}`);
  console.log(` email: ${user.email}`);
};
