"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path = __importStar(require("path"));
const serialport_1 = __importDefault(require("serialport"));
const sdk_1 = require("../libs/obnizio/sdk");
const user_1 = __importDefault(require("../libs/obnizio/user"));
const config_1 = __importDefault(require("../libs/os/config"));
const erase_1 = __importDefault(require("../libs/os/erase"));
const flash_1 = __importDefault(require("../libs/os/flash"));
const flashcreate_1 = __importDefault(require("../libs/os/flashcreate"));
const login_1 = __importDefault(require("../libs/user/login"));
const logout_1 = __importDefault(require("../libs/user/logout"));
const os_1 = __importDefault(require("../libs/obnizio/os"));
const Storage = __importStar(require("../libs/storage"));
const rendererHost = "http://localhost:9998";
const originalStderrWrite = process.stderr.write.bind(process.stderr);
const originalStdoutWrite = process.stdout.write.bind(process.stdout);
const api_key = null;
// stdout, stderrをRendererにも送る
function forwardOutput(enable) {
    if (enable) {
        process.stderr.write = (chunk) => {
            mainWindow.webContents.send("console:stderr", chunk);
            return originalStderrWrite(chunk);
        };
        process.stdout.write = (chunk) => {
            mainWindow.webContents.send("console:stderr", chunk);
            return originalStdoutWrite(chunk);
        };
    }
    else {
        process.stderr.write = originalStderrWrite;
        process.stdout.write = originalStdoutWrite;
    }
}
let mainWindow = null;
electron_1.app.on("ready", () => {
    mainWindow = new electron_1.BrowserWindow({
        width: 980,
        height: 600,
        minWidth: 980,
        minHeight: 600,
        frame: false,
        webPreferences: {
            nodeIntegration: false,
            preload: path.join(__dirname, "preload.js"),
        },
    });
    // Electronに表示するhtmlを絶対パスで指定（相対パスだと動かない）
    mainWindow.loadURL(`${rendererHost}/index.html`);
    // ChromiumのDevツールを開く
    mainWindow.webContents.openDevTools();
    mainWindow.on("closed", () => {
        mainWindow = null;
    });
    electron_1.ipcMain.handle("system:close", async (event, arg) => {
        electron_1.app.quit();
    });
    electron_1.ipcMain.handle("system:maximize", async (event, arg) => {
        mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize();
    });
    electron_1.ipcMain.handle("system:minimize", async (event, arg) => {
        mainWindow.minimize();
    });
    electron_1.ipcMain.handle("link:open", async (event, arg) => {
        electron_1.shell.openExternal(arg.url);
    });
    electron_1.ipcMain.handle("obniz:api_login", async (event, arg) => {
        const sdk = sdk_1.getClientSdk(arg.key);
        sdk
            .getTokenPermission()
            .then((res) => {
            if (res.token.device !== "none") {
                Storage.set("token", api_key);
                mainWindow.loadURL(`${rendererHost}/main.html`);
            }
            else {
                mainWindow.webContents.send("obniz:login_failed");
            }
        })
            .catch((e) => {
            throw e;
        });
    });
    electron_1.ipcMain.handle("obniz:login", async (event, arg) => {
        await login_1.default();
        // mainWindow!.loadURL(`${rendererHost}/settings.html`);
        mainWindow.loadURL(`${rendererHost}/main.html`);
    });
    electron_1.ipcMain.handle("obniz:logout", async (event, arg) => {
        await logout_1.default();
        mainWindow.loadURL(`${rendererHost}/index.html`);
    });
    electron_1.ipcMain.handle("obniz:flash", async (event, arg) => {
        forwardOutput(true);
        await flash_1.default.execute({
            portname: arg.device,
            baud: parseInt(arg.baudrate),
            version: arg.os_ver,
            stdout: process.stdout.write,
            hardware: arg.hardware,
            debugserial: false,
        }).catch((e) => {
            throw e;
        });
        forwardOutput(false);
    });
    electron_1.ipcMain.handle("obniz:erase", async (event, arg) => {
        erase_1.default({
            portname: arg.device,
            baud: arg.baudrate,
            stdout: (text) => {
                process.stdout.write(text);
            },
        })
            .then((success) => {
            mainWindow.webContents.send("obniz:erased", success);
        })
            .catch((e) => {
            throw e;
        });
    });
    electron_1.ipcMain.handle("obniz:create", async (event, arg) => {
        const token = Storage.get("token");
        const params = {
            token,
            port: arg.device,
            portname: arg.device,
            baud: arg.baudrate,
            hardware: arg.hardware,
            version: arg.os_ver,
        };
        if (arg.description) {
            params.description = arg.description;
        }
        if (arg.config_json) {
            params.config = arg.config_json;
        }
        if (arg.opname) {
            params.operation = arg.opname;
        }
        if (arg.indication_id) {
            params.indication = arg.indication_id;
        }
        if (arg.qrcode) {
            params.bindtoken = true;
            params.serial_token = arg.qrcode;
        }
        if (arg.obniz_id) {
            params.obniz_id = arg.obniz_id;
        }
        forwardOutput(true);
        await flashcreate_1.default.execute(params, (i) => {
            mainWindow.webContents.send("write:proceed", i);
        }).catch((e) => {
            console.log(e);
            mainWindow.webContents.send("error:occurred");
        });
        forwardOutput(false);
    });
    electron_1.ipcMain.handle("obniz:config", async (event, arg) => {
        const token = Storage.get("token");
        const params = {
            token,
            port: arg.device,
            portname: arg.device,
            baud: arg.baudrate,
        };
        if (arg.description) {
            params.description = arg.description;
        }
        if (arg.config_json) {
            params.config = arg.config_json;
        }
        if (arg.opname) {
            params.operation = arg.opname;
        }
        if (arg.indication_id) {
            params.indication = arg.indication_id;
        }
        forwardOutput(true);
        await config_1.default.execute(params, (i) => {
            mainWindow.webContents.send("write:proceed", i);
        }).catch((e) => {
            console.log(e);
            mainWindow.webContents.send("error:occurred", {});
        });
        forwardOutput(false);
    });
    electron_1.ipcMain.on("obniz:userinfo", async (event, arg) => {
        try {
            const token = Storage.get("token");
            if (token) {
                const user = await user_1.default(token);
                if (user) {
                    event.returnValue = { name: user.name, email: user.email };
                }
            }
            else {
                event.returnValue = {};
            }
        }
        catch (e) {
            throw e;
        }
    });
    electron_1.ipcMain.on("obniz:hardwares", async (event, arg) => {
        const hardwares = await os_1.default.hardwares();
        event.returnValue = hardwares;
    });
    electron_1.ipcMain.on("obniz:versions", async (event, arg) => {
        const versions = await os_1.default.list(arg.hardware);
        event.returnValue = versions;
    });
    electron_1.ipcMain.on("devices:list", async (event, arg) => {
        const ports = await serialport_1.default.list();
        event.returnValue = ports;
    });
    electron_1.ipcMain.on("json:open", async (event, arg) => {
        electron_1.dialog
            .showOpenDialog(mainWindow, {
            filters: [{ name: "obniz Configuration File", extensions: ["json"] }],
            properties: ["openFile"],
        })
            .then((result) => {
            const filePaths = result.filePaths;
            if (filePaths.length !== 0) {
                // ファイル読み込み
                console.log(filePaths[0]);
                event.returnValue = filePaths[0];
            }
            else {
                event.returnValue = null;
            }
        });
    });
});
//# sourceMappingURL=main.js.map