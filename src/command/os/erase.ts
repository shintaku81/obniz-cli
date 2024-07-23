import { getLogger } from "../../libs/logger/index.js";
import { erase } from "../../libs/os/erase.js";
import { PreparePort } from "../../libs/os/serial/prepare.js";
import { Command } from "../arg.js";

export const EraseCommand: Command = {
  help: "Fully erase a flash on target device.",
  async execute(args: any) {
    const port = await PreparePort(args);
    const logger = getLogger();
    logger.log("Erasing...");

    try {
      await erase(port);
    } catch (e) {
      logger.log("Error:" + ((e as Error).message || e));
    }
  },
};
