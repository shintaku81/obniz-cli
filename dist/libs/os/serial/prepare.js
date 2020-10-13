"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const readline = __importStar(require("readline"));
const defaults_1 = __importDefault(require("../../../defaults"));
const ports_1 = __importDefault(require("../ports"));
const guess_1 = __importDefault(require("./guess"));
exports.default = async (args) => {
    let portname = args.p || args.port;
    if (!portname) {
        console.log("No port specified.");
        // display port list
        const ports = await ports_1.default();
        const guessed_portname = await guess_1.default();
        if (guessed_portname) {
            console.log(`Guessed Serial Port ${guessed_portname}`);
            const use = await askUseGuessedPort(guessed_portname);
            if (use) {
                portname = guessed_portname;
            }
        }
        if (!portname) {
            const selected = await selectPort(ports);
            portname = selected;
        }
    }
    let baud = args.b || args.baud;
    if (!baud) {
        baud = defaults_1.default.BAUD;
    }
    return {
        portname,
        baud,
    };
};
function askUseGuessedPort(guessed_portname) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return new Promise((resolve, reject) => {
        rl.question(`Use guessed port(${guessed_portname}?) (y or n)`, (answer) => {
            rl.close();
            if (answer === "y") {
                resolve(true);
            }
            else if (answer === "n") {
                resolve(false);
            }
            else {
                reject(new Error("Enter y or n"));
            }
        });
    });
}
function selectPort(ports) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return new Promise((resolve, reject) => {
        let portCatalog;
        if (ports.length == 0) {
            reject(new Error(`No port found.`));
        }
        else if (ports.length == 1) {
            portCatalog = "0";
        }
        else {
            portCatalog = `0 to ${ports.length - 1}`;
        }
        rl.question(`Select a port from the list above. (integer from ${portCatalog})`, (answer) => {
            rl.close();
            const selected = ports[answer];
            if (selected) {
                resolve(selected.path);
            }
            else {
                reject(new Error(`Enter integer from 0 to ${ports.length - 1}`));
            }
        });
    });
}
