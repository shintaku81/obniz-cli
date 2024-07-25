import { getLogger } from "../../libs/logger/index.js";
import { erase } from "../../libs/os/erase.js";
import { PreparePort } from "../common/prepare_port.js";
import { Command } from "../arg.js";
import { PortArgs } from "../parameters.js";

export type EraseCommandArgs = PortArgs;

export const EraseCommand = {
  help: "Fully erase a flash on target device.",
  async execute(args: EraseCommandArgs) {
    const logger = getLogger();
    const port = await PreparePort(args);
    logger.log("Erasing...");

    await erase(port);
  },
} as const satisfies Command;
