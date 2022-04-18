import { SpinnerName } from "cli-spinners";
import { Color, Ora, PersistOptions, PrefixTextGenerator, Spinner } from "ora";

class OraConsole implements Ora {
  public color: Color = "black";
  public indent: number = 2;
  public readonly isSpinning: boolean = false;
  public prefixText: string | PrefixTextGenerator = "";
  public spinner: SpinnerName | Spinner = "dots";
  private _text = "";
  set text(t) {
    if (t) {
      console.log(`info: ${t}`);
    }
    this._text = t;
  }
  get text() {
    return this._text;
  }

  constructor(options: any) {
    if (typeof options === "string") {
      options = {
        text: options,
      };
    }
    // console.log(options.text);
  }

  public clear(): Ora {
    return this;
  }

  public fail(text?: string): Ora {
    console.log(`fail: ${text}`);
    return this;
  }

  public frame(): string {
    return "";
  }

  public info(text?: string): Ora {
    if (text) {
      console.log(`info: ${text}`);
    }
    return this;
  }

  public render(): Ora {
    return this;
  }

  public start(text?: string): Ora {
    if (text) {
      console.log(`info: ${text}`);
    }
    return this;
  }

  public stop(): Ora {
    return this;
  }

  public stopAndPersist(options?: PersistOptions): Ora {
    return this;
  }

  public succeed(text?: string): Ora {
    if (text) {
      console.log(`info: ${text}`);
    }
    return this;
  }

  public warn(text?: string): Ora {
    console.log(`warn: ${text}`);
    return this;
  }
}

const create = (option: any) => {
  return new OraConsole(option);
};
export default create;
