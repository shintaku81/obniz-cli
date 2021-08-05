import fs from "fs";
import path from "path";

const filepath = path.join(__dirname, "../..", "storage.json");

function read(): any {
  let obj = {};
  try {
    const txt = fs.readFileSync(filepath, { encoding: "utf8" });
    obj = JSON.parse(txt);
  } catch (e) {}

  return obj;
}

function write(obj: any) {
  fs.writeFileSync(filepath, JSON.stringify(obj));
}

export function set(key: string, value: string | null) {
  const obj = read();
  obj[key] = value;
  write(obj);
}

export function get(key: string) {
  return read()[key];
}
