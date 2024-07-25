import minimist from "minimist";
import { getLogger, setLogger } from "../libs/logger/index.js";
import { SimpleLogger } from "../libs/logger/simpleLogger.js";

const args = minimist(process.argv.slice(2), {
  "--": true,
  string: ["id", "i"],
});

const packageverion = "unknown version";

export interface Command {
  help: string | (() => Promise<void>);
  execute(args: any): Promise<void>;
}

export const Args = async (routes: Record<string, Command>) => {
  if (!args._) {
    throw new Error(`No Command Provided`);
  } else if (args._.length > 1) {
    throw new Error(`Too Many Command`);
  }
  const command = args._[0];
  const route = routes[command];
  if (args["v"]) {
    setLogger(new SimpleLogger(SimpleLogger.LEVEL_DEBUG));
  }
  if (args.help) {
    if (route && route.help) {
      console.log(`Usage for\n$obniz-cli ${command}\n`);
      if (typeof route.help === "function") {
        await route.help();
      } else {
        console.log(`${route.help}`);
      }
    } else {
      await routes.help.execute({});
    }
  } else {
    if (!route) {
      if (args.version || args.v) {
        console.log(`version ${packageverion}`);
        return;
      }
      console.error(`Unknown Command ${command} see below help`);
      await routes.help.execute({});
      return;
    }
    try {
      await route.execute(args);
    } catch (e) {
      const logger = getLogger();
      if (e instanceof Error) {
        if (args["v"]) {
          logger.error(e);
        } else {
          logger.error(e.message);
        }
      } else {
        logger.error(e);
      }
    }
  }
};
