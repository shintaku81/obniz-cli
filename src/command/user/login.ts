import { Login } from "../../libs/obnizio/login.js";
import User from "../../libs/obnizio/user.js";
import * as Storage from "../../libs/storage.js";

import { getOra } from "../../libs/ora-console/getora.js";

const ora = getOra();

export const LoginCommand = async (app?: { id: string; token: string }) => {
  let spinner = ora(`Singin...`).start();
  const token = await Login((text) => {
    spinner.text = text;
  }, app);
  spinner.succeed(`Authenticated.`);
  spinner = ora(`Getting User Information`).start();
  const user = await User(token);
  if (!user) {
    spinner.fail("Get user information failed");
    return;
  }
  Storage.set("token", token);
  spinner.succeed(`Sign in as "${user.email}"`);
};
