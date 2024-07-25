import chalk from "chalk";
import semver from "semver";
import { PromiseType } from "utility-types";
import { Operation } from "../../obnizio/operation.js";
import { OperationResult } from "../../obnizio/operation_result.js";
import { OperationSetting } from "../../obnizio/operation_setting.js";
import { getDefaultStorage } from "../../storage.js";
import { ObnizOsInteractiveSerial } from "../serial/interactive_serial.js";

import { Ora } from "ora";
import { getOra } from "../../ora-console/getora.js";
import { getLogger } from "../../logger/index.js";
import { SerialPort } from "serialport";
import { SerialPortSelect } from "../../../types.js";

const ora = getOra();

export interface ConfigParam {
  token: string;
  portname: string;
  stdout: (text: string) => void;
  configs: {
    devicekey: string;
    config: NetworkConfig | NetworkConfigBefore3_5_0;
  };
  via: string;
  operation?: {
    operation?: PromiseType<ReturnType<typeof Operation.getByOperationName>>;
    operationSetting?: PromiseType<
      ReturnType<typeof OperationSetting.getByIndication>
    >;
  };
}

export type NetworkType =
  | "wirelesslan"
  | "wifimesh"
  | "wiredlan"
  | "cellularmodule";

export interface NetworkConfig {
  net: NetworkType;
  wifi?: any;
  wifimesh?: any;
  ether?: any;
  cellular?: any;
  passkey?: string;
  wifi_channel?: string;
}

export interface NetworkConfigBefore3_5_0 {
  networks: Array<{
    type: "wifi" | "ethernet" | "cellular";
    settings: {
      ssid?: string;
      password?: string;
      meshid?: string;

      hidden?: boolean;
      dhcp?: boolean;
      static_ip?: string;
      subnetmask?: string;
      dns?: string;
      proxy?: boolean;
      proxy_address?: string;
      proxy_port?: number;
    };
  }>;
}

export interface DeviceAndNetworkConfig {
  deviceConfig: { obnizId: string; devicekey: string };
  networkConfig: NetworkConfig | NetworkConfigBefore3_5_0;
}
export interface OnlyDeviceConfig {
  deviceConfig: { obnizId: string; devicekey: string };
  networkConfig: null;
}
export interface OnlyNetworkConfig {
  deviceConfig: null;
  networkConfig: NetworkConfig | NetworkConfigBefore3_5_0;
}

export const execConfig = async (
  config: DeviceAndNetworkConfig | OnlyDeviceConfig | OnlyNetworkConfig,
  port: SerialPortSelect,
  usingOperation: boolean,
): Promise<{ obnizId: string; version: string } | null> => {
  // Return if no configs required

  const deviceConfig = config.deviceConfig;
  const networkConfig = config.networkConfig;

  const logger = getLogger();

  const interactiveSerial = new ObnizOsInteractiveSerial({
    portname: port.portname,
    stdout: (text: string) => {
      logger.debug(text);
    },
    onerror: (err: string) => {
      logger.log(interactiveSerial.totalReceived);
      throw new Error(`${err}`);
    },
    progress: (text: string, option: any = {}) => {
      logger.debug(text);
      if (option.keep) {
        spinner.text = text;
      } else {
        spinner = nextSpinner(spinner, `Configure: ${text}`);
      }
    },
  });
  let spinner = ora(
    `Configure: Opening Serial Port ${chalk.green(port.portname)}`,
  ).start();

  let info = null;
  try {
    await interactiveSerial.open();

    // config devicekey
    if (deviceConfig) {
      await interactiveSerial.setDeviceKey(deviceConfig.devicekey);
    }

    // config network
    if (networkConfig) {
      // JSON provided by user

      // detect Target obnizOS
      info = await interactiveSerial.detectedObnizOSVersion();
      spinner.succeed(
        `Configure: Detect Target obnizOS. version=${chalk.green(info.version)} ${chalk.green(info.obnizId)}`,
      );

      if (semver.satisfies(info.version, ">=3.5.0")) {
        await execNetworkConfigUpper3_5_0(
          networkConfig as NetworkConfig,
          interactiveSerial,
          spinner,
        );
      } else {
        if (usingOperation) {
          throw new Error(`Cannot use operation on obnizOS ver < 3.5.0`);
        }
        await execNetworkConfigUnder3_5_0(
          networkConfig as NetworkConfigBefore3_5_0,
          interactiveSerial,
          spinner,
        );
      }
    }
    await interactiveSerial.close();
  } catch (e) {
    console.log(interactiveSerial.totalReceived);
    spinner.fail(`Configure: Failed ${e}`);
    throw e;
  }

  spinner.succeed(`Configure: Success`);
  return info;
};

function nextSpinner(spinner: Ora, text: string) {
  spinner.succeed();
  spinner = ora(text).start();
  return spinner;
}

async function execNetworkConfigUpper3_5_0(
  networkConfig: NetworkConfig,
  interactiveSerial: ObnizOsInteractiveSerial,
  spinner: Ora,
) {
  if ("networks" in networkConfig) {
    throw new Error(
      `You can't use older version of network configuration json file.`,
    );
  }
  // menu mode and json flashing enabled device.
  await interactiveSerial.setAllFromMenu(networkConfig);
}

async function execNetworkConfigUnder3_5_0(
  networkConfig: NetworkConfigBefore3_5_0,
  interactiveSerial: ObnizOsInteractiveSerial,
  spinner: Ora,
) {
  if (!("networks" in networkConfig)) {
    throw new Error(
      `please provide "networks". see more detail at example json file`,
    );
  }

  // virtual UI.
  const networks = networkConfig.networks;
  if (!Array.isArray(networks)) {
    throw new Error(`"networks" must be an array`);
  }
  if (networks.length !== 1) {
    throw new Error(`"networks" must have single object in array.`);
  }
  const network = networks[0];
  const type = network.type;
  const settings = network.settings;
  await interactiveSerial.setNetworkType(type);
  if (type === "wifi") {
    await interactiveSerial.setWiFi(settings);
  } else {
    spinner.fail(`Configure: Not Supported Network Type ${type}`);
    throw new Error(
      `obniz-cli not supporting settings for ${type} right now. wait for future release`,
    );
  }
}
