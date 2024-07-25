import { SimpleLogger } from "./simpleLogger.js";

export interface StepLogger {
  updateStatus(message: string): void;
  finish(message?: string): void;
  failed(message?: string): void;
}

export interface Logger {
  log(...args: any[]): void;
  step(stepName: string): StepLogger;
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
