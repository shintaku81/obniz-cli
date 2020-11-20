import Login from "../obnizio/login";
import User from "../obnizio/user";
import * as Storage from "../storage";

import ora from "ora";

export default async () => {
  let spinner = ora(`Singin...`).start();
  const token = await Login((text) => {
    spinner.text = text;
  });
  spinner.succeed(`Authenticated.`);
  spinner = ora(`Getting User Information`).start();
  const user = await User(token);
  Storage.set("token", token);
  spinner.succeed(`Sign in as "${user.email}"`);
};
