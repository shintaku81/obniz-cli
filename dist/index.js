"use strict";
if (typeof process.env.ELECTRON_RUN_AS_NODE === "undefined") {
    require("./cli");
}
else {
    require("./gui/index");
}
//# sourceMappingURL=index.js.map