import path from "path";

export default (hw: string, version: string, type: string) => {
  let relative = "../..";
  if (__dirname.indexOf("/dist/") >= 0) {
    relative += "/..";
  }
  const map = {
    bootloader: "__bootloader.bin",
    partition: "__partition.bin",
    app: ".bin",
  };
  return path.join(__dirname, relative, `temp`, `obnizos__${hw}__${version}${map[type]}`);
};
