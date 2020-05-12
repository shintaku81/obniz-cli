"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const args = require("minimist")(process.argv.slice(2), { "--": true });
async function execute(routes) {
    const command = args._;
    if (!command) {
        throw new Error(`No Command Provided`);
    }
    else if (args._ > 1) {
        throw new Error(`Too Many Command`);
    }
    const route = routes[command];
    if (args.help) {
        if (route && route.help) {
            await route.help();
        }
        else {
            await routes.help();
        }
    }
    else {
        if (!route) {
            throw new Error(`Unknown Command ${command}`);
        }
        await route.execute(args);
    }
}
exports.default = execute;
