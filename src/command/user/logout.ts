import * as Storage from "../../libs/storage";

export const LogoutCommand = async () => {
  Storage.set("token", null);
  console.log(`Signed out`);
};
