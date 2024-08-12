import path from "path";
import fs from "fs";
import {
  NetworkConfig,
  NetworkConfigBefore3_5_0,
} from "../../libs/os/configure/index.js";

export const PrepareConfigFromFile = async (input: {
  c?: string;
  config?: string;
}): Promise<{ config: NetworkConfig | NetworkConfigBefore3_5_0 } | null> => {
  const configPath = input.c || input.config;
  if (!configPath) {
    return null;
  }
  const filepath = path.isAbsolute(configPath)
    ? configPath
    : path.join(process.cwd(), configPath);
  if (!fs.existsSync(filepath)) {
    throw new Error(`config file ${filepath} does not exist!!`);
  }
  const jsonString = fs.readFileSync(filepath, { encoding: "utf8" });
  let json = null;
  try {
    json = JSON.parse(jsonString);
  } catch (e) {
    console.error(`Can't read config file as json`);
    throw e;
  }
  return json ? { config: json } : null;
};
