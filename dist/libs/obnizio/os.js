"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const graphql_request_1 = require("graphql-request");
const node_fetch_1 = __importDefault(require("node-fetch"));
const path_1 = __importDefault(require("path"));
const semver_1 = __importDefault(require("semver"));
const Storage = __importStar(require("../storage"));
const filepath_1 = __importDefault(require("./filepath"));
const url_1 = require("./url");
class OS {
    static async list(hardware, type = null) {
        const headers = {};
        const token = Storage.get("token");
        if (token && type !== "public") {
            headers.authorization = `Bearer ${token}`;
        }
        const graphQLClient = new graphql_request_1.GraphQLClient(url_1.GraphQLURL, {
            headers,
        });
        const query = `{
      os(hardware: "${hardware}") {
        version,
        app_url,
        bootloader_url,
        partition_url
      }
    }`;
        const ret = await graphQLClient.request(query);
        return ret.os;
    }
    static async hardwares(type = null) {
        const headers = {};
        const token = Storage.get("token");
        if (token && type !== "public") {
            headers.authorization = `Bearer ${token}`;
        }
        const graphQLClient = new graphql_request_1.GraphQLClient(url_1.GraphQLURL, {
            headers,
        });
        const query = `{
      hardwares {
        hardware
      }
    }`;
        const ret = await graphQLClient.request(query);
        return ret.hardwares;
    }
    static async latestPublic(hardware) {
        const versions = await this.list(hardware, "public");
        for (const v of versions) {
            if (!semver_1.default.prerelease(v)) {
                return v.version;
            }
        }
        throw new Error(`No available obnizOS Found for ${hardware}`);
    }
    static async os(hardware, version) {
        const versions = await this.list(hardware, null);
        for (const v of versions) {
            if (v.version === version) {
                return v;
            }
        }
        throw new Error(`No obnizOS and Version Found for hardware=${hardware} version=${version}`);
    }
    static async prepareLocalFile(hardware, version, progress) {
        const appPath = filepath_1.default(hardware, version, "app");
        const bootloaderPath = filepath_1.default(hardware, version, "bootloader");
        const partitionPath = filepath_1.default(hardware, version, "partition");
        let v;
        if (!fs_1.default.existsSync(appPath)) {
            if (!v) {
                v = await this.os(hardware, version);
            }
            progress(`Downloading from obnizCloud`);
            await downloadFile(v.app_url, appPath);
        }
        if (!fs_1.default.existsSync(bootloaderPath)) {
            if (!v) {
                v = await this.os(hardware, version);
            }
            progress(`Downloading from obnizCloud`);
            await downloadFile(v.bootloader_url, bootloaderPath);
        }
        if (!fs_1.default.existsSync(partitionPath)) {
            if (!v) {
                v = await this.os(hardware, version);
            }
            progress(`Downloading from obnizCloud`);
            await downloadFile(v.partition_url, partitionPath);
        }
        return {
            app_path: appPath,
            bootloader_path: bootloaderPath,
            partition_path: partitionPath,
        };
    }
}
exports.default = OS;
async function downloadFile(url, pathtodownload) {
    const dirpath = path_1.default.dirname(pathtodownload);
    if (!fs_1.default.existsSync(dirpath)) {
        fs_1.default.mkdirSync(dirpath);
    }
    const res = await node_fetch_1.default(url);
    const fileStream = fs_1.default.createWriteStream(pathtodownload);
    await new Promise((resolve, reject) => {
        res.body.pipe(fileStream);
        res.body.on("error", (err) => {
            reject(err);
        });
        fileStream.on("finish", () => {
            resolve();
        });
    });
}
//# sourceMappingURL=os.js.map