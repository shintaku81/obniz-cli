"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const esptool_js_1 = require("@9wick/esptool.js");
const serial_1 = require("@9wick/esptool.js/build/node/serial");
exports.default = async (obj) => {
    obj.stdout("", { clear: true });
    const port = new serial_1.EsptoolSerial(obj.portname, {
        baudRate: 115200,
        autoOpen: false,
    });
    await port.open();
    const espTool = new esptool_js_1.EspLoader(port, {
        debug: false,
        logger: {
            log(message, ...optionalParams) { },
            debug(message, ...optionalParams) { },
            error(message, ...optionalParams) { },
        },
    });
    await espTool.connect();
    const chipName = await espTool.chipName();
    const macAddr = await espTool.macAddr();
    console.log("chipName", chipName);
    console.log("macAddr", macAddr);
    await espTool.loadStub();
    await espTool.setBaudRate(115200, obj.baud);
    console.log("Start erase");
    await espTool.eraseFlash();
    console.log("Chip erase completed successfully");
    await port.close();
};
//# sourceMappingURL=erase.js.map