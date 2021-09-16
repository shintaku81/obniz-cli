import { app, BrowserWindow, dialog, ipcMain, shell } from "electron";
import * as path from "path";

import SerialPort from "serialport";
import Device from "../libs/obnizio/device";
import { getClientSdk } from "../libs/obnizio/sdk";
import User from "../libs/obnizio/user";
import Config from "../libs/os/config";
import Erase from "../libs/os/erase";
import Flash from "../libs/os/flash";
import Create from "../libs/os/flashcreate";
import PreparePort from "../libs/os/serial/prepare";
import Login from "../libs/user/login";
import Logout from "../libs/user/logout";

import OS from "../libs/obnizio/os";
import * as Storage from "../libs/storage";

const rendererHost = "http://localhost:9998";

const originalStderrWrite = process.stderr.write.bind(process.stderr);
const originalStdoutWrite = process.stdout.write.bind(process.stdout);

const api_key: string | null = null;

// stdout, stderrをRendererにも送る
function forwardOutput(enable: boolean): void {
  if (enable) {
    process.stderr.write = (chunk: string | Uint8Array) => {
      mainWindow!.webContents.send("console:stderr", chunk);
      return originalStderrWrite(chunk);
    };
    process.stdout.write = (chunk: string | Uint8Array) => {
      mainWindow!.webContents.send("console:stderr", chunk);
      return originalStdoutWrite(chunk);
    };
  } else {
    process.stderr.write = originalStderrWrite;
    process.stdout.write = originalStdoutWrite;
  }
}

let mainWindow: Electron.BrowserWindow | null = null;
app.on("ready", () => {
  mainWindow = new BrowserWindow({
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
  mainWindow!.loadURL(`${rendererHost}/index.html`);
  // ChromiumのDevツールを開く
  mainWindow!.webContents.openDevTools();

  mainWindow!.on("closed", () => {
    mainWindow = null;
  });

  ipcMain.handle("system:close", async (event: any, arg: any) => {
    app.quit();
  });
  ipcMain.handle("system:maximize", async (event: any, arg: any) => {
    mainWindow!.isMaximized() ? mainWindow!.unmaximize() : mainWindow!.maximize();
  });
  ipcMain.handle("system:minimize", async (event: any, arg: any) => {
    mainWindow!.minimize();
  });

  ipcMain.handle("link:open", async (event: any, arg: any) => {
    shell.openExternal(arg.url);
  });

  ipcMain.handle("obniz:api_login", async (event: any, arg: any) => {
    const sdk = getClientSdk(arg.key);
    sdk
      .getTokenPermission()
      .then((res) => {
        if (res!.token!.device !== "none") {
          Storage.set("token", api_key);
          mainWindow!.loadURL(`${rendererHost}/main.html`);
        } else {
          mainWindow!.webContents.send("obniz:login_failed");
        }
      })
      .catch((e) => {
        throw e;
      });
  });

  ipcMain.handle("obniz:login", async (event: any, arg: any) => {
    await Login();
    // mainWindow!.loadURL(`${rendererHost}/settings.html`);
    mainWindow!.loadURL(`${rendererHost}/main.html`);
  });
  ipcMain.handle("obniz:logout", async (event: any, arg: any) => {
    await Logout();
    mainWindow!.loadURL(`${rendererHost}/index.html`);
  });

  ipcMain.handle("obniz:flash", async (event: any, arg: any) => {
    forwardOutput(true);
    await Flash.execute({
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

  ipcMain.handle("obniz:erase", async (event: any, arg: any) => {
    Erase({
      portname: arg.device,
      baud: arg.baudrate,
      stdout: (text: string) => {
        process.stdout.write(text);
      },
    })
      .then((success) => {
        mainWindow!.webContents.send("obniz:erased", success);
      })
      .catch((e) => {
        throw e;
      });
  });

  ipcMain.handle("obniz:create", async (event: any, arg: any) => {
    const token = Storage.get("token");
    const params: any = {
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
    await Create.execute(params, (i: number) => {
      mainWindow!.webContents.send("write:proceed", i);
    }).catch((e) => {
      console.log(e);
      mainWindow!.webContents.send("error:occurred");
    });
    forwardOutput(false);
  });

  ipcMain.handle("obniz:config", async (event: any, arg: any) => {
    const token = Storage.get("token");
    const params: any = {
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
    await Config.execute(params, (i: number) => {
      mainWindow!.webContents.send("write:proceed", i);
    }).catch((e) => {
      console.log(e);
      mainWindow!.webContents.send("error:occurred", {});
    });
    forwardOutput(false);
  });

  ipcMain.on("obniz:userinfo", async (event: any, arg: any) => {
    try {
      const token = Storage.get("token");
      if (token) {
        const user = await User(token);
        if (user) {
          event.returnValue = { name: user!.name, email: user!.email };
        }
      } else {
        event.returnValue = {};
      }
    } catch (e) {
      throw e;
    }
  });

  ipcMain.on("obniz:hardwares", async (event: any, arg: any) => {
    const hardwares = await OS.hardwares();
    event.returnValue = hardwares;
  });

  ipcMain.on("obniz:versions", async (event: any, arg: any) => {
    const versions = await OS.list(arg.hardware);
    event.returnValue = versions;
  });

  ipcMain.on("devices:list", async (event: any, arg: any) => {
    const ports: SerialPort.PortInfo[] = await SerialPort.list();
    event.returnValue = ports;
  });

  ipcMain.on("json:open", async (event: any, arg: any) => {
    dialog
      .showOpenDialog(mainWindow!, {
        filters: [{ name: "obniz Configuration File", extensions: ["json"] }],
        properties: ["openFile"],
      })
      .then((result: any) => {
        const filePaths = result.filePaths;
        if (filePaths.length !== 0) {
          // ファイル読み込み
          console.log(filePaths[0]);
          event.returnValue = filePaths[0];
        } else {
          event.returnValue = null;
        }
      });
  });
});
