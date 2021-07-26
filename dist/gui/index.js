"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = void 0;
const express_1 = __importDefault(require("express"));
const get_port_1 = __importDefault(require("get-port"));
const path_1 = __importDefault(require("path"));
const puppeteer_core_1 = __importDefault(require("puppeteer-core"));
const socket_io_1 = __importDefault(require("socket.io"));
const _flash_1 = __importDefault(require("../libs/os/_flash"));
const auto_detect_1 = __importDefault(require("../libs/os/serial/auto_detect"));
// ========== Definitions =========
const devices = [];
let version = null;
const files = [];
for (let file of files) {
    if (file.indexOf(".elf") >= 0) {
        file = file.replace(".elf", "");
        const splitted = file.split("__");
        if (splitted.length < 3) {
            continue;
        }
        devices.push(splitted[1]);
        version = splitted[2];
    }
}
// ========== vars =========
let portTTYName = null;
let browser;
let page;
let io;
let port;
// ========== Express/Socket.io =========
async function start() {
    port = await get_port_1.default();
    const relative = "../..";
    const app = express_1.default();
    app.use(express_1.default.static(path_1.default.join(__dirname, relative, "public")));
    const server = require("http").createServer(app);
    io = socket_io_1.default(server);
    server.listen(port);
    server.on("error", (err) => {
        console.error(err);
        process.exit();
    });
    server.on("listening", async () => {
        await launch();
    });
    io.on("connection", async (socket) => {
        socket.on("flash", async (data) => {
            try {
                const hardware = data.version;
                const license = data.license;
                let found = false;
                for (const device of devices) {
                    if (device === hardware) {
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    throw new Error(`No Such a os ${hardware}`);
                }
                const baud = 1500000;
                const success = await _flash_1.default({
                    portname: portTTYName,
                    debugserial: true,
                    hardware,
                    version: "1.0.0",
                    baud,
                    stdout: ui_print,
                });
                if (success) {
                    await ui_print("<br>**********<br> DONE/書き込み完了 (^-^) <br>********<br>", { type: "success" });
                }
                else {
                    await ui_print("<br>NGNGNGNGNG FAIL?/失敗かも (>_<) NGNGNGNG<br>", { type: "error" });
                    throw new Error("NG");
                }
                if (license) {
                    // const hwIdentifier = "esp32w";
                    // const obnizid = await registerObnizId(portTTYName, hwIdentifier);
                    // await ui_print(`<br>**********<br> License/ライセンス完了 (^0^) <br>********<br>`, { type: "success" });
                    // await ui_print(`<br>obniz ID = ${obnizid}`, { type: "success" });
                }
            }
            catch (e) {
                console.error(e);
                await ui_print("" + e, { type: "error" });
            }
            ui_state_to("normal");
        });
        socket.on("exit", async (data) => {
            process.exit();
        });
        await startUI();
    });
}
exports.start = start;
// ========== Functions =========
async function launch() {
    const opt = {
        headless: false,
    };
    const osvar = process.platform;
    if (osvar === "darwin") {
        opt.executablePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
    }
    else {
        opt.executablePath = "/usr/bin/chromium-browser";
        opt.args = ["--kiosk", "--disable-infobars"];
    }
    browser = await puppeteer_core_1.default.launch(opt);
    browser.on("disconnected", () => {
        process.exit();
    });
    page = (await browser.pages())[0];
    // await page.setViewport({
    //   width: 480,
    //   height: 320,
    // });
    await page.goto(`http://localhost:${port}/index.html`);
    page.on("close", () => {
        process.exit();
    });
}
async function startUI() {
    await ui_versions();
    await ui_print("Searching USB...", { clear: true });
    portTTYName = await auto_detect_1.default();
    await ui_print("Found:USB " + portTTYName, { clear: true });
    ui_state_to("normal");
}
async function ui_print(text, options = {}) {
    text = text.replace("\n", "<br>");
    text = text.replace("\r", "<br>");
    io.emit("print", { text, options });
}
async function ui_versions() {
    io.emit("version", version);
    io.emit("devices", devices);
}
async function ui_state_to(state) {
    io.emit("state_to", state);
}
// function registerObnizId(portname, hwIdentifier) {
//   return new Promise(async (resolve, reject) => {
//     let timeoutTimer = setTimeout(() => {
//       reject(new Error("Timeout"));
//     }, 10 * 1000);
//     const serialport = new SerialPort(portname, { baudRate: 115200 });
//     serialport.on("open", () => {
//       // open logic
//       serialport.set({
//         rts: false,
//         dtr: false,
//       });
//       let total = "";
//       let obnizid;
//       serialport.write(`\n`);
//       console.log("serialport opened " + portname);
//       serialport.on("readable", async () => {
//         const received = serialport.read().toString("utf-8");
//         console.log(received);
//         total += received;
//         ui_print(received);
//         if (total.indexOf("DeviceKey") >= 0) {
//           try {
//             const keypair = KeyPair.gen();
//             // obnizid = await ObnizApi.registrate(hwIdentifier, keypair.pubkey);
//             const devicekey = `${obnizid}&${keypair.privkey}`;
//             console.log(devicekey);
//             serialport.write(`${devicekey}\n`);
//             total = "";
//           } catch (e) {
//             ui_print("" + e);
//           }
//           // found
//         }
//         if (total.indexOf("obniz id:") >= 0) {
//           serialport.close(() => {
//             if (timeoutTimer) {
//               clearTimeout(timeoutTimer);
//               timeoutTimer = null;
//             }
//             if (obnizid) {
//               resolve(obnizid);
//             } else {
//               reject("already exist obniz id!!!");
//             }
//           });
//         }
//       });
//     });
//     serialport.on("error", (err) => {
//       reject(err);
//     });
//   });
// }
