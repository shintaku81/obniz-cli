import { Logger } from "./index.js";

export class DebugLogger {
  constructor(private logger: Logger) {}
  log(...args: any[]) {
    this.logger.debug(...args);
  }
  debug(...args: any[]) {
    this.logger.debug(...args);
  }
  error(...args: any[]) {
    this.logger.debug(...args);
  }
}
