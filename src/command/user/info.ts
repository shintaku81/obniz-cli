import User from "../../libs/obnizio/user.js";
import { getDefaultStorage } from "../../libs/storage.js";

export const UserInfoCommand = async () => {
  const token = getDefaultStorage().get("token");
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
