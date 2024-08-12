import fs from "fs";
import path from "path";
import { __dirname } from "./dirname.js";
const filepath = path.join(__dirname, "../..", "storage.json");

export class Storage {
  read(): any {
    let obj = {};
    try {
      const txt = fs.readFileSync(filepath, { encoding: "utf8" });
      obj = JSON.parse(txt);
    } catch (e) {
      // do nothing
    }

    return obj;
  }

  write(obj: any) {
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
