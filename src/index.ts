
// https://www.electronjs.org/docs/latest/api/process#processtype-readonly
if (typeof process.env.type === "undefined") {
  require("./cli");
} else {
  require("./gui/index");
}
