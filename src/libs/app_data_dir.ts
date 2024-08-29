import path from "node:path";

import { __dirname } from "./dirname.js";

let filepath = path.join(__dirname, "../.."); //デフォルトはpackage.jsonと同じ階層にする

export const setAppDataDir = (path: string) => {
  filepath = path;
};

export const getAppDataDir = () => {
  return filepath;
};
