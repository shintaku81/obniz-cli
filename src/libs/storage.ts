import fs from "fs";
import path from "path";
import { getAppDataDir } from "./app_data_dir.js";

export class Storage {
  read(): any {
    let obj = {};
    try {
      const filepath = path.join(getAppDataDir(), "storage.json");
      const txt = fs.readFileSync(filepath, { encoding: "utf8" });
      obj = JSON.parse(txt);
    } catch (e) {
      // do nothing
    }

    return obj;
  }

  write(obj: any) {
    const filepath = path.join(getAppDataDir(), "storage.json");
    fs.writeFileSync(filepath, JSON.stringify(obj));
  }

  set(key: string, value: string | null) {
    const obj = this.read();
    obj[key] = value;
    this.write(obj);
  }

  get(key: string) {
    return this.read()[key];
  }
}

let _storage: Storage | null = null;
export const getDefaultStorage = () => {
  if (!_storage) {
    _storage = new Storage();
  }
  return _storage;
};
