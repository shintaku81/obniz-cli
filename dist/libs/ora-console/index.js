"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class OraConsole {
    constructor(options) {
        this.color = "black";
        this.indent = 2;
        this.isSpinning = false;
        this.prefixText = "";
        this.spinner = "dots";
        this._text = "";
        if (typeof options === "string") {
            options = {
                text: options,
            };
        }
        // console.log(options.text);
    }
    set text(t) {
        if (t) {
            console.log(`info: ${t}`);
        }
        this._text = t;
    }
    get text() {
        return this._text;
    }
    clear() {
        return this;
    }
    fail(text) {
        console.log(`fail: ${text}`);
        return this;
    }
    frame() {
        return "";
    }
    info(text) {
        if (text) {
            console.log(`info: ${text}`);
        }
        return this;
    }
    render() {
        return this;
    }
    start(text) {
        if (text) {
            console.log(`info: ${text}`);
        }
        return this;
    }
    stop() {
        return this;
    }
    stopAndPersist(options) {
        return this;
    }
    succeed(text) {
        if (text) {
            console.log(`info: ${text}`);
        }
        return this;
    }
    warn(text) {
        console.log(`warn: ${text}`);
        return this;
    }
}
const create = (option) => {
    return new OraConsole(option);
};
exports.default = create;
//# sourceMappingURL=index.js.map