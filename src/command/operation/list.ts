import { Operation } from "../../libs/obnizio/operation.js";
import * as Storage from "../../libs/storage.js";
import { Command } from "../arg.js";

export const OperationListCommand: Command = {
  help: `Show your operation list
      --token       Token of api key which use instead of user signin.
  `,
  async execute(args: any) {
    const token = args.token || Storage.get("token");
    if (!token) {
      console.log(`Not Sign In`);
      return;
    }
    if (!(await Operation.checkPermission(token))) {
      console.log(
        `You don't have Facility permission. Please 'obniz-cli signin' again`,
      );
      return;
    }

    console.log(`Contacting to obniz Cloud...`);

    const operations = await Operation.getList(token);

    operations.map((op) => {
      console.log(` - ${op?.node?.name} (${op?.facilityName})`);
    });
  },
};
