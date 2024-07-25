import { toHex } from "@9wick/adafruit-webserial-esptool/dist/util.js";

export class SimpleLogger {
  static LEVEL_ERROR = 100;
  static LEVEL_LOG = 200;
  static LEVEL_DEBUG = 300;
  currentStep: SimpleStepLogger | null = null;

  constructor(private level: number = SimpleLogger.LEVEL_LOG) {}
  log(...args: any[]) {
    if (this.level < SimpleLogger.LEVEL_LOG) {
      return;
    }
    this.logMsg(...args);
  }
  debug(...args: any[]) {
    if (this.level < SimpleLogger.LEVEL_DEBUG) {
      return;
    }
    this.debugMsg(...args);
  }
  error(...args: any[]) {
    if (this.level < SimpleLogger.LEVEL_ERROR) {
      return;
    }
    this.debugMsg(...args);
  }

  logMsg(...msg: any[]) {
    console.log(...msg);
  }

  step(stepName: string) {
    const newStep = new SimpleStepLogger(this, stepName);
    if (this.currentStep && !this.currentStep.isFinished) {
      this.currentStep.finish();
    }
    this.currentStep = newStep;
    return newStep;
  }

  debugMsg(...args: any[]) {
    const prefix = "";
    for (const arg of args) {
      if (arg === undefined) {
        this.logMsg(prefix + "undefined");
      } else if (arg === null) {
        this.logMsg(prefix + "null");
      } else if (typeof arg == "string") {
        this.logMsg(prefix + arg);
      } else if (typeof arg == "number") {
        this.logMsg(prefix + arg);
      } else if (typeof arg == "boolean") {
        this.logMsg(prefix + (arg ? "true" : "false"));
      } else if (Array.isArray(arg)) {
        this.logMsg(
          prefix + "[" + arg.map((value) => toHex(value)).join(", ") + "]",
        );
        // this.logMsg(prefix + "[" + Buffer.from(arg).toString("ascii") + "]");
      } else if (typeof arg == "object" && arg instanceof Uint8Array) {
        this.logMsg(
          prefix +
            "[" +
            Array.from(arg)
              .map((value) => toHex(value))
              .join(", ") +
            // Buffer.from(arg).toString("ascii") +
            "]",
        );
      } else {
        this.logMsg(prefix + "Unhandled type of argument:" + typeof arg);
        console.log(arg);
      }
    }
  }
}

class SimpleStepLogger {
  isFinished = false;
  constructor(
    private logger: SimpleLogger,
    private stepName: string,
  ) {}
  updateStatus(message: string) {
    this.logger.log(`${this.stepName} :  ${message}`);
  }
  finish(message?: string) {
    this.logger.log(`${this.stepName} :  ${message || "finish"}`);
    this.isFinished = true;
  }
  failed(message?: string) {
    this.logger.error(`${this.stepName} :  ${message || "failed"}`);
    this.isFinished = true;
  }
}
