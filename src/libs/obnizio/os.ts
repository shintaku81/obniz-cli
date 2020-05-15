import { GraphQLClient } from "graphql-request";
import semver from 'semver';
import filepath from './filepath'
import fs from 'fs';
import path from 'path'
import fetch from 'node-fetch'

export default class OS {

  static async list(hardware: string, token?:string) {
    let headers:any = {}
    if (token) {
      headers.authorization = `Bearer ${token}`
    }
    const graphQLClient = new GraphQLClient(`https://api.obniz.io/v1/graphql`, {
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
    return ret.os
  }

  static async latestPublic(hardware: string) {
    const versions = await this.list(hardware);
    for(const v of versions) {
      if(!semver.prerelease(v)) {
        return v.version;
      }
    }
    throw new Error(`No available obnizOS Found for ${hardware}`);
  }

  static async os(hardware:string, version: string) {
    const versions = await this.list(hardware);
    for(const v of versions) {
      if (v.version === version) {
        return v;
      }
    }
    throw new Error(`No obnizOS Found for ${hardware}`);
  }

  static async prepareLocalFile(hardware:string, version: string) { 
    const appPath = filepath(hardware, version, 'app');
    const bootloaderPath = filepath(hardware, version, 'bootloader');
    const partitionPath = filepath(hardware, version, 'partition');
    let v;
    if (!fs.existsSync(appPath)) {
      if (!v) {
        v = await this.os(hardware, version);
      }
      await downloadFile(v.app_url, appPath);
    }
    if (!fs.existsSync(bootloaderPath)) {
      if (!v) {
        v = await this.os(hardware, version);
      }
      await downloadFile(v.bootloader_url, bootloaderPath);
    }
    if (!fs.existsSync(partitionPath)) {
      if (!v) {
        v = await this.os(hardware, version);
      }
      await downloadFile(v.partition_url, partitionPath);
    }
    return {
      app_path: appPath,
      bootloader_path: bootloaderPath,
      partition_path: partitionPath
    }
  }
}

async function downloadFile(url, filepath) {
  console.log(`Downloading ${url}`);

  const dirpath = path.dirname(filepath);
  if (!fs.existsSync(dirpath)) {
    fs.mkdirSync(dirpath);
  }

  const res = await fetch(url);
  const fileStream = fs.createWriteStream(filepath);
  await new Promise((resolve, reject) => {
      res.body.pipe(fileStream);
      res.body.on("error", (err) => {
        reject(err);
      });
      fileStream.on("finish", function() {
        resolve();
      });
    });
};
