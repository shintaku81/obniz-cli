import { SimpleLogger } from "./simpleLogger.js";

export interface Logger {
  log(...args: any[]): void;
  debug(...args: any[]): void;
  error(...args: any[]): void;
}

let loggerInstance: null | Logger = null;

export function setLogger(logger: Logger) {
  loggerInstance = logger;
}

export function getLogger() {
  if (loggerInstance == null) {
    loggerInstance = new SimpleLogger();
  }
  return loggerInstance;
}
