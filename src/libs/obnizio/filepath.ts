import path from "path";

export default (hw: string, version: string, type: string) => {
  const relative = "../../../";
  const map: any = {
    bootloader: "__bootloader.bin",
    partition: "__partition.bin",
    app: ".bin",
  };
  return path.join(__dirname, relative, `temp`, `obnizos__${hw}__${version}${map[type]}`);
};
