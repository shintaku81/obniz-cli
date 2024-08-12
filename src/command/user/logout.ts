import { getDefaultStorage } from "../../libs/storage.js";

export const LogoutCommand = async () => {
  getDefaultStorage().set("token", null);
  console.log(`Signed out`);
};
