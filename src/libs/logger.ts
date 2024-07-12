import { toHex } from "@9wick/adafruit-webserial-esptool/dist/util.js";

function logMsg(...msg: any[]) {
  console.log(...msg);
}

function debugMsg(...args: any[]) {
  const prefix = "";
  for (const arg of args) {
    if (arg === undefined) {
      logMsg(prefix + "undefined");
    } else if (arg === null) {
      logMsg(prefix + "null");
    } else if (typeof arg == "string") {
      logMsg(prefix + arg);
    } else if (typeof arg == "number") {
      logMsg(prefix + arg);
    } else if (typeof arg == "boolean") {
      logMsg(prefix + (arg ? "true" : "false"));
    } else if (Array.isArray(arg)) {
      // logMsg(prefix + "[" + arg.map((value) => toHex(value)).join(", ") + "]");
      logMsg(prefix + "[" + Buffer.from(arg).toString("ascii") + "]");
    } else if (typeof arg == "object" && arg instanceof Uint8Array) {
      logMsg(
        prefix +
          "[" +
          // Array.from(arg)
          //   .map((value) => toHex(value))
          //   .join(", ") +
          Buffer.from(arg).toString("ascii") +
          "]",
      );
    } else {
      logMsg(prefix + "Unhandled type of argument:" + typeof arg);
      console.log(arg);
    }
  }
}

export class Logger {
  log(...args: any[]) {
    logMsg(...args);
  }
  debug(...args: any[]) {
    debugMsg(...args);
  }
  error(...args: any[]) {
    debugMsg(...args);
  }
}

const loggerInstance = new Logger();

export function getLogger() {
  return loggerInstance;
}
