import * as readline from "readline";

import Defaults from "../../../defaults";
import Ports from "../ports";
import SerialGuess from "./guess";

export default async (args: any): Promise<any> => {
  let portname: string = args.p || args.port;

  if (!portname) {
    console.log("No port specified.");
    // display port list
    const ports = await Ports();

    const guessed_portname = await SerialGuess();
    if (guessed_portname) {
      console.log(`Guessed Serial Port ${portname}`);
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

  let baud: any = args.b || args.baud;
  if (!baud) {
    baud = Defaults.BAUD;
  }

  return {
    portname,
    baud,
  };
};

function askUseGuessedPort(guessed_portname: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve, reject) => {
    rl.question(`Use guessed port(${guessed_portname}?) (y or n)`, (answer) => {
      if (answer === "y") {
        resolve(true);
      } else if (answer === "n") {
        resolve(false);
      } else {
        reject(new Error("Enter y or n"));
      }
    });
  });
}

function selectPort(ports: any): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve, reject) => {
    rl.question(`Select a port from the list above. (integer from 0 to ${ports.length - 1})`, (answer) => {
      const selected = ports[answer];
      if (selected) {
        resolve(selected.path);
      } else {
        reject(new Error(`Enter integer from 0 to ${ports.length - 1}`));
      }
    });
  });
}
