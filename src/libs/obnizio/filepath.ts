import path from "path";
import { getAppDataDir } from "../app_data_dir.js";

export default (hw: string, version: string, type: string) => {
  const map: any = {
    bootloader: "__bootloader.bin",
    partition: "__partition.bin",
    app: ".bin",
  };

  return path.join(
    getAppDataDir(),
    `temp`,
    `obnizos__${hw}__${version}${map[type]}`,
  );
};
