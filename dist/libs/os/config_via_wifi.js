"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const wifi_1 = __importDefault(require("./wifi"));
exports.default = {
    help: `Configure ObnizOS network via Wi-Fi from devices.

 [configrations]
 -c --config      configuration file path. If specified obniz-cli proceed settings following file like setting wifi SSID/Password.
  `,
    async execute(args) {
        let configs;
        // Network Setting
        const configPath = args.c || args.config;
        if (configPath) {
            const filepath = path_1.default.isAbsolute(configPath) ? configPath : path_1.default.join(process.cwd(), configPath);
            if (!fs_1.default.existsSync(filepath)) {
                throw new Error(`config file ${filepath} does not exist!!`);
            }
            const jsonString = fs_1.default.readFileSync(filepath, { encoding: "utf8" });
            let json = null;
            try {
                json = JSON.parse(jsonString);
            }
            catch (e) {
                console.error(`Can't read config file as json`);
                throw e;
            }
            configs = json;
        }
        //
        if (!configs) {
            // no configration provided
            console.log(`No configration found. exit.`);
            return;
        }
        // Init Wi-Fi
        const wifi = new wifi_1.default({
            stdout: (text) => {
                process.stdout.write(text);
            },
            onerror: (err) => {
                throw new Error(`${err}`);
            },
        });
        // Configure network via wifi
        const networks = configs.networks;
        if (!networks) {
            throw new Error(`please provide "networks". see more detail at example json file`);
        }
        if (!Array.isArray(networks)) {
            throw new Error(`"networks" must be an array`);
        }
        if (networks.length !== 1) {
            throw new Error(`"networks" must have single object in array.`);
        }
        const network = networks[0];
        const type = network.type;
        const settings = network.settings;
        // TODO: setNetworkType?
        if (type === "wifi") {
            await wifi.setWiFi(settings);
        }
        else {
            console.log(chalk_1.default.red(`obniz-cli not supporting settings for ${type} right now. wait for future release`));
        }
    },
};
