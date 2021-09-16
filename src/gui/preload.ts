import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electron", {
  systemClose: async (arg: any) => await ipcRenderer.invoke("system:close", arg),
  systemMaximize: async (arg: any) => await ipcRenderer.invoke("system:maximize", arg),
  systemMinimize: async (arg: any) => await ipcRenderer.invoke("system:minimize", arg),

  api_login: async (api_key: string) => await ipcRenderer.invoke("obniz:api_login", { key: api_key }),
  login: async () => await ipcRenderer.invoke("obniz:login", {}),
  logout: async () => await ipcRenderer.invoke("obniz:logout", {}),

  userinfo: () => ipcRenderer.sendSync("obniz:userinfo", {}),

  devicePorts: () => ipcRenderer.sendSync("devices:list", { devicePort: "execute" }),
  hardwares: () => ipcRenderer.sendSync("obniz:hardwares", {}),
  versions: (hardware: string) => ipcRenderer.sendSync("obniz:versions", { hardware }),

  erase: (args: any) => {
    return new Promise((resolve) => {
      ipcRenderer.invoke("obniz:erase", args);
      ipcRenderer.on("obniz:erased", (event, success) => {
        resolve(success);
      });
    });
  },
  flash: async (arg: any) => await ipcRenderer.invoke("obniz:flash", arg),
  create: async (arg: any) => await ipcRenderer.invoke("obniz:create", arg),
  config: async (arg: any) => await ipcRenderer.invoke("obniz:config", arg),

  proceed: async (func: (args: number) => void) => ipcRenderer.on("write:proceed", (event, arg) => func(arg)),

  stderr: (func: (args: string | Uint8Array) => void) => ipcRenderer.on("console:stderr", (event, args) => func(args)),

  opendialog: () => ipcRenderer.sendSync("json:open", {}),
  cmdError: (func: () => void) => ipcRenderer.on("error:occurred", (event, args) => func()),

  externalLink: async (url: string) => await ipcRenderer.invoke("link:open", { url }),
});
