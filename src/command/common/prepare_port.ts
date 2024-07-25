import { DefaultParams } from "../../defaults.js";
import { SerialGuess } from "../../libs/os/serial/guess.js";

import chalk from "chalk";
import inquirer from "inquirer";
import { serial } from "@9wick/node-web-serial-ponyfill";
import { SerialPortSelect } from "../../types.js";
import { getLogger } from "../../libs/logger/index.js";

export const PreparePort = async (
  port: Partial<SerialPortSelect>,
): Promise<SerialPortSelect> => {
  const logger = getLogger();
  if (!port.portname) {
    logger.log(chalk.yellow(`No serial port specified.`));
  }

  const autoChoose = port.portname === "AUTO";
  const userInputPortname = autoChoose ? undefined : port.portname;

  const ports = await serial.listPorts();
  // display port list
  // const ports: SerialPort.PortInfo[] = await SerialPort.list();
  // Specified. check ports

  let selectedPortname: string | null = null;
  if (userInputPortname && (await isExistPort(userInputPortname))) {
    selectedPortname = userInputPortname;
  } else {
    const guessedPortname = (await SerialGuess()).portname;
    if (autoChoose && guessedPortname) {
      selectedPortname = guessedPortname;
    } else {
      const list = ports.map((p) => {
        const info = (p as any).info_;
        return { path: info.path, manufacturer: info.man };
      });
      selectedPortname = await selectPort(list, guessedPortname);
    }
  }

  const baud = port.baud ?? DefaultParams.BAUD;

  logger.log(
    `Serial Port: decided ${chalk.green(selectedPortname)} baudrate ${baud}`,
  );

  return {
    portname: selectedPortname,
    baud,
  };
};

async function isExistPort(portname: string) {
  const ports = await serial.listPorts();
  for (const port of ports) {
    const info = (port as any).info_;
    if (info.path === portname) {
      return true;
    }
  }
  return false;
}

async function selectPort(
  ports: Array<{ path: string; manufacturer?: string }>,
  defaultValue: any,
): Promise<string> {
  const portNames = [];
  for (let i = 0; i < ports.length; i++) {
    const port = ports[i];
    portNames.push({
      name: `${port.path}${port.manufacturer ? ` (${port.manufacturer})` : ``}`,
      value: port.path,
    });
  }

  const answer = await inquirer.prompt([
    {
      type: "list",
      name: "port",
      message: "Serial Ports available on your machine",
      choices: portNames,
      default: defaultValue,
    },
  ]);
  return answer.port;
}
