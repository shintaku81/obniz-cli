"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_request_1 = require("graphql-request");
const semver_1 = __importDefault(require("semver"));
const filepath_1 = __importDefault(require("./filepath"));
const fs_1 = __importDefault(require("fs"));
const node_fetch_1 = __importDefault(require("node-fetch"));
class OS {
    static async list(hardware, token) {
        let headers = {};
        if (token) {
            headers.authorization = `Bearer ${token}`;
        }
        const graphQLClient = new graphql_request_1.GraphQLClient(`https://api.obniz.io/v1/graphql`, {
            headers
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
    static async latestPublic(hardware) {
        const versions = await this.list(hardware);
        for (const v of versions) {
            if (!semver_1.default.prerelease(v)) {
                return v.version;
            }
        }
        throw new Error(`No available obnizOS Found for ${hardware}`);
    }
    static async os(hardware, version) {
        const versions = await this.list(hardware);
        for (const v of versions) {
            console.log(version, v.version);
            if (v.version === version) {
                return v;
            }
        }
        throw new Error(`No obnizOS Found for ${hardware}`);
    }
    static async prepareLocalFile(hardware, version) {
        const appPath = filepath_1.default(hardware, version, 'app');
        const bootloaderPath = filepath_1.default(hardware, version, 'bootloader');
        const partitionPath = filepath_1.default(hardware, version, 'partition');
        let v;
        if (!fs_1.default.existsSync(appPath)) {
            if (!v) {
                v = await this.os(hardware, version);
            }
            await downloadFile(v.app_url, appPath);
        }
        if (!fs_1.default.existsSync(bootloaderPath)) {
            if (!v) {
                v = await this.os(hardware, version);
            }
            await downloadFile(v.bootloader_url, bootloaderPath);
        }
        if (!fs_1.default.existsSync(partitionPath)) {
            if (!v) {
                v = await this.os(hardware, version);
            }
            await downloadFile(v.partition_url, partitionPath);
        }
        return {
            app_path: appPath,
            bootloader_path: bootloaderPath,
            partition_path: partitionPath
        };
    }
}
exports.default = OS;
async function downloadFile(url, path) {
    console.log(`Downloading ${url}`);
    const res = await node_fetch_1.default(url);
    const fileStream = fs_1.default.createWriteStream(path);
    await new Promise((resolve, reject) => {
        res.body.pipe(fileStream);
        res.body.on("error", (err) => {
            reject(err);
        });
        fileStream.on("finish", function () {
            resolve();
        });
    });
}
;
