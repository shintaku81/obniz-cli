const args = require("minimist")(process.argv.slice(2), { "--": true, "string": ["id", "i"] });

const packageverion = require(`../package.json`).version;

export interface Command {
  help: string | (() => Promise<void>);
  execute(...args: any): Promise<void>;
}

export const Args = async (routes: Record<string, Command>) => {
  const command = args._;
  if (!command) {
    throw new Error(`No Command Provided`);
  } else if (args._ > 1) {
    throw new Error(`Too Many Command`);
  }
  const route = routes[command];
  if (args.help) {
    if (route && route.help) {
      console.log(`Usage for\n$obniz-cli ${command}\n`);
      if (typeof route.help === "function") {
        await route.help();
      } else {
        console.log(`${route.help}`);
      }
    } else {
      await routes.help.execute();
    }
  } else {
    if (!route) {
      if (args.version || args.v) {
        console.log(`version ${packageverion}`);
        return;
      }
      console.error(`Unknown Command ${command} see below help`);
      await routes.help.execute();
      return;
    }
    await route.execute(args);
  }
};
