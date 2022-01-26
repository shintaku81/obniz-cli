if (typeof process.env.type === "undefined") {
  require("./cli");
} else {
  require("./gui/index");
}
