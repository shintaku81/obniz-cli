import { GraphQLClient } from 'graphql-request';
import { print } from 'graphql';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** ISO-8601 Format DateTime */
  Date: any;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
  /** [Int] Limitation of query results. range is 1..50 */
  first: any;
  /** [Int] offset of query results. range is 0<= */
  skip: any;
};


export type DeviceDeleteAccessTokenInput = {
  obniz?: Maybe<DeviceDeleteAccessTokenInputDevice>;
};

export type DeviceDeleteAccessTokenInputDevice = {
  /** obnizID */
  id: Scalars['String'];
};

export type DeviceGenerateAccessTokenInput = {
  obniz?: Maybe<DeviceGenerateAccessTokenInputDevice>;
};

export type DeviceGenerateAccessTokenInputDevice = {
  /** obnizID */
  id: Scalars['String'];
};

/** Root of api.obniz.com graphql api endpoint mutations */
export type Mutation = {
  __typename?: 'Mutation';
  /** Create New Event */
  createEvent?: Maybe<Event>;
  /** Update Exist Event */
  updateEvent?: Maybe<Event>;
  /** Delete Exist Event */
  deleteEvent: Scalars['ID'];
  /** Create New Device */
  createDevice?: Maybe<Device>;
  /** Registration New Device */
  registrateDevice?: Maybe<Device>;
  /** Update Device */
  updateDevice?: Maybe<Device>;
  /** Generate Device Access Token */
  generateDeviceAccessToken?: Maybe<Device>;
  /** Delete Device Access Token */
  deleteDeviceAccessToken?: Maybe<Device>;
  /** Edit Settings For Installed App */
  updateDeviceSettingsForInstalledApp?: Maybe<Device>;
  /** Install App To Device */
  installApp?: Maybe<Device>;
  /** Install App To Device */
  uninstallApp?: Maybe<Device>;
  updateStatusOperationSetting?: Maybe<UpdateStatusOperationSettingResult>;
  createOperationResult?: Maybe<OperationResult>;
  removeOperationResult?: Maybe<RemoveOperationResultResponse>;
};


/** Root of api.obniz.com graphql api endpoint mutations */
export type MutationCreateEventArgs = {
  event: EventCreateInput;
};


/** Root of api.obniz.com graphql api endpoint mutations */
export type MutationUpdateEventArgs = {
  event: EventUpdateInput;
};


/** Root of api.obniz.com graphql api endpoint mutations */
export type MutationDeleteEventArgs = {
  id: Scalars['ID'];
};


/** Root of api.obniz.com graphql api endpoint mutations */
export type MutationCreateDeviceArgs = {
  device: DeviceCreateInput;
};


/** Root of api.obniz.com graphql api endpoint mutations */
export type MutationRegistrateDeviceArgs = {
  device: DeviceRegistrateInput;
};


/** Root of api.obniz.com graphql api endpoint mutations */
export type MutationUpdateDeviceArgs = {
  device: DeviceUpdateInput;
};


/** Root of api.obniz.com graphql api endpoint mutations */
export type MutationGenerateDeviceAccessTokenArgs = {
  device: DeviceGenerateAccessTokenInput;
};


/** Root of api.obniz.com graphql api endpoint mutations */
export type MutationDeleteDeviceAccessTokenArgs = {
  device: DeviceDeleteAccessTokenInput;
};


/** Root of api.obniz.com graphql api endpoint mutations */
export type MutationUpdateDeviceSettingsForInstalledAppArgs = {
  edit: DeviceInstalledAppSettingsInput;
};


/** Root of api.obniz.com graphql api endpoint mutations */
export type MutationInstallAppArgs = {
  install: AppInstallInput;
};


/** Root of api.obniz.com graphql api endpoint mutations */
export type MutationUninstallAppArgs = {
  uninstall: AppUninstallInput;
};


/** Root of api.obniz.com graphql api endpoint mutations */
export type MutationUpdateStatusOperationSettingArgs = {
  operationSettingId: Scalars['ID'];
};


/** Root of api.obniz.com graphql api endpoint mutations */
export type MutationCreateOperationResultArgs = {
  operationResult: CreateOperationResultInput;
};


/** Root of api.obniz.com graphql api endpoint mutations */
export type MutationRemoveOperationResultArgs = {
  operationSettingId: Scalars['ID'];
};

/** Root of api.obniz.com graphql api endpoint queries */
export type Query = {
  __typename?: 'Query';
  /** My WebApp Configration on obniz.com regarding accessToken. */
  webapp?: Maybe<Webapp>;
  /** My App Configration on obniz.com regarding accessToken. */
  app?: Maybe<App>;
  /** User information which is authorized for current Access Token. */
  user?: Maybe<User>;
  /** Devices a user has */
  devices?: Maybe<DeviceConnection>;
  /** User Configured Serverless Events */
  events?: Maybe<EventConnection>;
  /** Registrated obniz hardware list on obniz Cloud */
  hardwares: Array<Maybe<Hardware>>;
  /** obnizOS versions on obniz Cloud for queried hardware */
  os: Array<Maybe<Os>>;
  /** Query App event history. */
  appEvents?: Maybe<AppEvents>;
  operations?: Maybe<OperationsConnection>;
  operationSettings?: Maybe<OperationSettingsConnection>;
  operationResults?: Maybe<OperationResultsConnection>;
};


/** Root of api.obniz.com graphql api endpoint queries */
export type QueryDevicesArgs = {
  first?: Maybe<Scalars['first']>;
  skip?: Maybe<Scalars['skip']>;
  id?: Maybe<Scalars['String']>;
  hw?: Maybe<Scalars['String']>;
  app?: Maybe<Scalars['Int']>;
  status?: Maybe<Scalars['String']>;
  created?: Maybe<Scalars['String']>;
  sort?: Maybe<Scalars['String']>;
  order?: Maybe<Scalars['String']>;
};


/** Root of api.obniz.com graphql api endpoint queries */
export type QueryEventsArgs = {
  first?: Maybe<Scalars['first']>;
  skip?: Maybe<Scalars['skip']>;
};


/** Root of api.obniz.com graphql api endpoint queries */
export type QueryOsArgs = {
  hardware: Scalars['String'];
};


/** Root of api.obniz.com graphql api endpoint queries */
export type QueryAppEventsArgs = {
  first?: Maybe<Scalars['first']>;
  skip?: Maybe<Scalars['skip']>;
};


/** Root of api.obniz.com graphql api endpoint queries */
export type QueryOperationsArgs = {
  id?: Maybe<Scalars['Int']>;
  facilityName?: Maybe<Scalars['String']>;
};


/** Root of api.obniz.com graphql api endpoint queries */
export type QueryOperationSettingsArgs = {
  first?: Maybe<Scalars['first']>;
  operationId?: Maybe<Scalars['ID']>;
  status?: Maybe<Scalars['Int']>;
};


/** Root of api.obniz.com graphql api endpoint queries */
export type QueryOperationResultsArgs = {
  first?: Maybe<Scalars['first']>;
  operationId?: Maybe<Scalars['ID']>;
  operationSettingId?: Maybe<Scalars['ID']>;
};


/** App object. This contains app information which created on obniz.com as App */
export type App = {
  __typename?: 'app';
  /** Unique Identifier of app */
  id: Scalars['ID'];
  /** English Title of app */
  title: Scalars['String'];
  /** English Description */
  short_body: Scalars['String'];
  /** Type of app. */
  type: Scalars['String'];
  /** Current Status on obniz.com app on explore */
  store_status: Scalars['String'];
  /** Query Installs for an App. */
  installs?: Maybe<AppInstallConnection>;
};


/** App object. This contains app information which created on obniz.com as App */
export type AppInstallsArgs = {
  first?: Maybe<Scalars['first']>;
  skip?: Maybe<Scalars['skip']>;
};

export type AppConfigInput = {
  key: Scalars['String'];
  value: Scalars['String'];
};

/** This contains information that was sent by the webhook in the past. */
export type AppEvent = {
  __typename?: 'appEvent';
  /** Unique Identifier of webhook for webapp */
  id: Scalars['Int'];
  /** The date and time the webhook was sent. */
  createdAt: Scalars['String'];
  /** Type of event, */
  type: Scalars['String'];
  app: AppEventApp;
  payload: AppEventPayload;
};

export type AppEventApp = {
  __typename?: 'appEventApp';
  /** Unique Identifier of webapp */
  id: Scalars['ID'];
};

/** Contains any of the following objects. */
export type AppEventPayload = {
  __typename?: 'appEventPayload';
  user?: Maybe<User>;
  device?: Maybe<Device>;
};

/** Connection of Device */
export type AppEvents = {
  __typename?: 'appEvents';
  /** Total Count of device edges */
  totalCount: Scalars['Int'];
  /** Page Information */
  pageInfo: PageInfo;
  /** Events */
  events: Array<Maybe<AppEvent>>;
};

/** Connection of Install */
export type AppInstallConnection = {
  __typename?: 'appInstallConnection';
  /** Total Count of device edges */
  totalCount: Scalars['Int'];
  /** Page Information */
  pageInfo: PageInfo;
  /** Edges */
  edges: Array<Maybe<AppInstallEdge>>;
};

/** Install Edge */
export type AppInstallEdge = {
  __typename?: 'appInstallEdge';
  /** Cursor */
  node?: Maybe<Installed_Device>;
};

export type AppInstallInput = {
  obniz?: Maybe<AppInstallInputDevice>;
  app?: Maybe<AppInstallInputApp>;
};

export type AppInstallInputApp = {
  /** appID */
  id: Scalars['ID'];
  config: Array<AppConfigInput>;
};

export type AppInstallInputDevice = {
  /** obnizID */
  id: Scalars['ID'];
};

export type AppUninstallInput = {
  obniz?: Maybe<AppUninstallInputDevice>;
};

export type AppUninstallInputDevice = {
  /** obnizID */
  id: Scalars['String'];
};

export type CreateOperationResultInput = {
  /** Operation setting ID. */
  operationSettingId: Scalars['ID'];
  /** Obniz ID. Format can be both xxxx-xxxx and xxxxxxxx. */
  obnizId?: Maybe<Scalars['String']>;
  /** Time when a device setting is written onto an obniz. */
  successfullyWrittenAt?: Maybe<Scalars['Date']>;
  /** Time when an obniz became online. */
  becomeOnlineAt?: Maybe<Scalars['Date']>;
  /** Binary data of operation picture. */
  picBinary?: Maybe<Scalars['Upload']>;
  /** Location note. */
  locationNote?: Maybe<Scalars['String']>;
  /**
   * Type of operation error. Possibities:
   *
   *             - エラーがない場合 -> 0
   *             - GWが見つからない (gwNotFound) -> 1
   *             - GWが複数見つかって特定できない (multiGw) -> 2
   *             - GWのWi-Fiにつながらない (cantConGw) -> 3
   *             - GWがWi-Fiにつながらない (gwCantConWifi) -> 4
   *
   *             - SSID違う/パスワード違う (invalidSsidOrPwd) -> 5
   *             - DNS解決できない (cantResolveDns) -> 6
   *             - ネットワークに出られない (cantGoOutNetwork)-> 7
   *             - GatewayのobnizOSが古くて通信できなかったときなど (cantComWithGw) -> 8
   */
  typeError: Scalars['Int'];
};

/** Device information */
export type Device = {
  __typename?: 'device';
  /** Unique Identifier like "0000-0000" */
  id: Scalars['ID'];
  /** Access Token */
  access_token?: Maybe<Scalars['String']>;
  /**
   * Description
   *
   *       Same value are exist on metadata.description
   */
  description: Scalars['String'];
  /**
   * User Defined Metadata JSON string
   *
   *       Useful for labeling device location or attached machine.
   */
  metadata: Scalars['String'];
  /**
   * DeviceKey
   *
   *       String representation of DeviceKey which installed or to be installed on the device.
   */
  devicekey?: Maybe<Scalars['String']>;
  /**
   * Hardware Identifier
   *
   *       'obnizb1': obniz Board
   *
   *       'obnizb2': obniz Board 1Y
   *
   *       'm5stickc': M5StickC
   *
   *       'esp32w': obnizOS for ESP32
   *
   *       'esp32p': obnizOS for ESP32 on ESP32-PICO
   *
   *       'encored': obniz BLE/Wi-Fi Gateway
   */
  hardware: Scalars['String'];
  /**
   * OS Identifier
   *
   *       'obnizb1': obniz Board
   *
   *       'obnizb2': obniz Board 1Y
   *
   *       'm5stickc': M5StickC
   *
   *       'esp32w': obnizOS for ESP32
   *
   *       'encored': obniz BLE/Wi-Fi Gateway
   */
  os: Scalars['String'];
  /** Last time recognized os version like '1.0.0' */
  osVersion: Scalars['String'];
  /**
   * Server Region
   *
   *       'jp': Japan(East Asia)
   *
   *       'us': United States of America(West-America)
   */
  region: Scalars['String'];
  /**
   * Status
   *
   *       'active': activated
   *
   *       'inactive': inactivated
   */
  status: Scalars['String'];
  /** Installed time */
  createdAt: Scalars['Date'];
  /** User information which is authorized for current Access Token. */
  user?: Maybe<User>;
  /** JSON Representation of Installed app configration */
  configs: Scalars['String'];
};

/** Connection of Device */
export type DeviceConnection = {
  __typename?: 'deviceConnection';
  /** Total Count of device edges */
  totalCount: Scalars['Int'];
  /** Page Information */
  pageInfo: PageInfo;
  /** Edges */
  edges: Array<Maybe<DeviceEdge>>;
};

export type DeviceCreateInput = {
  /**
   * Hardware Identifier
   *
   *       'esp32w': obnizOS for ESP32
   *
   *       'esp32p': obnizOS for ESP32 on ESP32-PICO
   */
  hardware: Scalars['String'];
  /**
   * Server Region
   *
   *       'jp': Japan(East Asia)
   *
   *       'us': United States of America(West-America)
   */
  region?: Maybe<Scalars['String']>;
  /**
   * Description
   *
   *       User Defined Metadata. Useful for labeling device location or attached machine.
   */
  description?: Maybe<Scalars['String']>;
  /**
   * Description
   *
   *       Option for manufacturer
   */
  serialdata?: Maybe<Scalars['String']>;
};

/** Device Edge */
export type DeviceEdge = {
  __typename?: 'deviceEdge';
  /** Cursor */
  node?: Maybe<Device>;
};

export type DeviceInstalledAppSettingsInput = {
  obniz?: Maybe<DeviceInstalledAppSettingsInputDevice>;
  app?: Maybe<DeviceInstalledAppSettingsInputApp>;
};

export type DeviceInstalledAppSettingsInputApp = {
  config: Array<AppConfigInput>;
};

export type DeviceInstalledAppSettingsInputDevice = {
  /** obnizID */
  id: Scalars['ID'];
};

export type DeviceRegistrateInput = {
  /** It can be obtained from the QR Code on the device. */
  registrateUrl: Scalars['String'];
};

export type DeviceUpdateInput = {
  /** obnizID */
  id: Scalars['ID'];
  /**
   * Server Region
   *
   *       'jp': Japan(East Asia)
   *
   *       'us': United States of America(West-America)
   */
  region?: Maybe<Scalars['String']>;
  /**
   * Use Defined Description
   *
   *       Same value are exist on metadata.description
   */
  description?: Maybe<Scalars['String']>;
  /**
   * User Defined Metadata key-value JSON string
   *
   *       Only key:string and value:string is accepted
   *       Useful for labeling device location or attached machine.
   */
  metadata?: Maybe<Scalars['String']>;
  /**
   * Status
   *
   *       'active': activated
   *
   *       'inactive': inactivated
   */
  status?: Maybe<Scalars['String']>;
};

/** ServerlessEvent */
export type Event = {
  __typename?: 'event';
  /** Unique Identifier */
  id: Scalars['ID'];
  /** User named */
  name: Scalars['String'];
  /**
   * Event trigger as string.
   *
   *       'webhook': webhook
   *
   *       'everyday/{hour}:{time}': timing on a day
   *
   *       'every/{time}{minutes or hours}': interval
   *
   *       'device/{obniz_id}/switch_state_push': device event switch pressed.
   *
   *       'device/{obniz_id}/online': device event online.
   */
  trigger: Scalars['String'];
  /**
   * Action uri
   *
   *       '{filename_in_repo}':
   *
   *       'webapp://{install_id}/run': installed webapp
   */
  action: Scalars['String'];
  /** webhook Endpoint if trigger is webhook. */
  webhookUri?: Maybe<Scalars['String']>;
  /** Created time */
  createdAt: Scalars['Date'];
};

/** Connection of Event */
export type EventConnection = {
  __typename?: 'eventConnection';
  /** Total Count of device edges */
  totalCount: Scalars['Int'];
  /** Page Information */
  pageInfo: PageInfo;
  /** Edges */
  edges: Array<Maybe<EventEdge>>;
};

export type EventCreateInput = {
  /** The Event name */
  name: Scalars['String'];
  /**
   * Event trigger as string.
   *
   *       'webhook': webhook
   *
   *       'everyday/{hour}:{time}': timing on a day
   *
   *       'every/{time}{minutes or hours}': interval
   *
   *       'device/{obniz_id}/switch_state_push': device event switch pressed.
   *
   *       'device/{obniz_id}/online': device event online.
   */
  trigger: Scalars['String'];
  /**
   * Action uri
   *
   *       '{filename_in_repo}':
   *
   *       'webapp://{install_id}/run': installed webapp
   */
  action: Scalars['String'];
};

/** Event Edge */
export type EventEdge = {
  __typename?: 'eventEdge';
  /** Cursor */
  node?: Maybe<Event>;
};

export type EventUpdateInput = {
  /** Unique Identifier */
  id: Scalars['ID'];
  /** The Event name */
  name: Scalars['String'];
  /**
   * Event trigger as string.
   *
   *       'webhook': webhook
   *
   *       'everyday/{hour}:{time}': timing on a day
   *
   *       'every/{time}{minutes or hours}': interval
   *
   *       'device/{obniz_id}/switch_state_push': device event switch pressed.
   *
   *       'device/{obniz_id}/online': device event online.
   */
  trigger: Scalars['String'];
  /**
   * Action uri
   *       '{filename_in_repo}':
   *       'webapp://{install_id}/run': installed webapp
   */
  action: Scalars['String'];
};


/** Hardware Information. This indicate related os information for each hardware */
export type Hardware = {
  __typename?: 'hardware';
  /** Hardware Identifier  */
  hardware: Scalars['String'];
  /** OS identifier for hardware. */
  os: Scalars['String'];
};

/** Installed WebApp object. This contains user installed webapp configration */
export type Install = {
  __typename?: 'install';
  /** Unique Identifier of install */
  id: Scalars['ID'];
  /** User information which is authorized for current Access Token. */
  user?: Maybe<User>;
  /** Installed time */
  createdAt: Scalars['Date'];
  /** Updated time */
  updatedAt: Scalars['Date'];
  /** JSON Representation of Installed app configration */
  configs: Scalars['String'];
};

/** Connection of Install */
export type InstallConnection = {
  __typename?: 'installConnection';
  /** Total Count of device edges */
  totalCount: Scalars['Int'];
  /** Page Information */
  pageInfo: PageInfo;
  /** Edges */
  edges: Array<Maybe<InstallEdge>>;
};

/** Install Edge */
export type InstallEdge = {
  __typename?: 'installEdge';
  /** Cursor */
  node?: Maybe<Install>;
};

/** Device information */
export type Installed_Device = {
  __typename?: 'installed_device';
  /** Unique Identifier like "0000-0000" */
  id: Scalars['ID'];
  /** Access Token */
  access_token?: Maybe<Scalars['String']>;
  /**
   * Description
   *
   *       Same value are exist on metadata.description
   */
  description: Scalars['String'];
  /**
   * User Defined Metadata JSON string
   *
   *       Useful for labeling device location or attached machine.
   */
  metadata: Scalars['String'];
  /**
   * DeviceKey
   *
   *       String representation of DeviceKey which installed or to be installed on the device.
   */
  devicekey?: Maybe<Scalars['String']>;
  /**
   * Hardware Identifier
   *
   *       'obnizb1': obniz Board
   *
   *       'obnizb2': obniz Board 1Y
   *
   *       'm5stickc': M5StickC
   *
   *       'esp32w': obnizOS for ESP32
   *
   *       'esp32p': obnizOS for ESP32 on ESP32-PICO
   *
   *       'encored': obniz BLE/Wi-Fi Gateway
   */
  hardware: Scalars['String'];
  /**
   * OS Identifier
   *
   *       'obnizb1': obniz Board
   *
   *       'obnizb2': obniz Board 1Y
   *
   *       'm5stickc': M5StickC
   *
   *       'esp32w': obnizOS for ESP32
   *
   *       'encored': obniz BLE/Wi-Fi Gateway
   */
  os: Scalars['String'];
  /** Last time recognized os version like '1.0.0' */
  osVersion: Scalars['String'];
  /**
   * Server Region
   *
   *       'jp': Japan(East Asia)
   *
   *       'us': United States of America(West-America)
   */
  region: Scalars['String'];
  /**
   * Status
   *
   *       'active': activated
   *
   *       'inactive': inactivated
   */
  status: Scalars['String'];
  /** Installed time */
  createdAt: Scalars['Date'];
  /** User information which is authorized for current Access Token. */
  user?: Maybe<User>;
  /** JSON Representation of Installed app configration */
  configs: Scalars['String'];
};

/** operation. */
export type Operation = {
  __typename?: 'operation';
  /** Unique identifier. */
  id: Scalars['ID'];
  /** Name of operation. */
  name: Scalars['String'];
  /** Facility ID which the operation targets at. */
  facilityId: Scalars['Int'];
  /** Criteria of completion. 0: written, 1: online. */
  completionLevel: Scalars['Int'];
  /** Evidence picture of completion is required if this param is true. */
  needPicEvidence: Scalars['Boolean'];
  /** Need to specify the exact device location if this param is true. */
  needLocationNote: Scalars['Boolean'];
  /** Time when the operation will be carried out. */
  dueDate?: Maybe<Scalars['Date']>;
  /** Token that is going to be inclued in the operation URL on Android APP. */
  operationKey: Scalars['String'];
  /** Time when the facility created at */
  createdAt: Scalars['Date'];
};

/** operation edge */
export type OperationEdge = {
  __typename?: 'operationEdge';
  /** Cursor. */
  node?: Maybe<Operation>;
  /** Facility name. */
  facilityName?: Maybe<Scalars['String']>;
  /** The amount of devices that are going to be set. */
  amountExpectedDevices?: Maybe<Scalars['Int']>;
  /** The amount of devices that have already been set. */
  amountOperatedDevices?: Maybe<Scalars['Int']>;
  /** The amount of reports including both error and information. */
  amountReport?: Maybe<Scalars['Int']>;
  /** Indicates whether or not error occurred and its error level if any. NoPrombelm Error. */
  errorLevelReport?: Maybe<Scalars['String']>;
};

/** Operation result. */
export type OperationResult = {
  __typename?: 'operationResult';
  /** Unique identifier. */
  id: Scalars['ID'];
  /** Operation Setting Id. */
  operationSettingId: Scalars['ID'];
  /** Indication Id. */
  indicationId: Scalars['String'];
  /** Obniz Id. */
  obnizId?: Maybe<Scalars['Int']>;
  /** Time when operation setting has been written. */
  successfullyWrittenAt?: Maybe<Scalars['Date']>;
  /** Time when a device became online. */
  becomeOnlineAt?: Maybe<Scalars['Date']>;
  /** Url of evidence picture. */
  picUrl?: Maybe<Scalars['String']>;
  /** Note about where a device has been set. */
  locationNote?: Maybe<Scalars['String']>;
  /** Error code of operation failure. */
  typeError?: Maybe<Scalars['Int']>;
};

/** Operation result edge. */
export type OperationResultEdge = {
  __typename?: 'operationResultEdge';
  /** Cursor */
  node?: Maybe<OperationResult>;
};

/** Operation result. */
export type OperationResultForOperationSetting = {
  __typename?: 'operationResultForOperationSetting';
  /** Obniz Id. */
  obnizId?: Maybe<Scalars['Int']>;
  /** Time when operation setting has been written. */
  successfullyWrittenAt?: Maybe<Scalars['Date']>;
  /** Time when a device became online. */
  becomeOnlineAt?: Maybe<Scalars['Date']>;
  /** Url of evidence picture. */
  picUrl?: Maybe<Scalars['String']>;
  /** Note about where a device has been set. */
  locationNote?: Maybe<Scalars['String']>;
  /** Error code of operation failure. */
  typeError?: Maybe<Scalars['Int']>;
};

/** Connection of operation results. */
export type OperationResultsConnection = {
  __typename?: 'operationResultsConnection';
  /** Total count of operation results edges */
  totalCount: Scalars['Int'];
  /** Edges. */
  edges: Array<Maybe<OperationResultEdge>>;
};

/** Operation setting */
export type OperationSetting = {
  __typename?: 'operationSetting';
  /** Unique identifier. */
  id: Scalars['ID'];
  /** Operation ID */
  operationId: Scalars['Int'];
  /** Indication ID. */
  indicationId: Scalars['String'];
  /**
   * String representation of network config.
   *             // 第一優先ネットワーク。
   *             // wirelesslanの場合、wifiを全部試す => だめなら他にあるのを全部試す
   * 	          net: "wirelesslan" // availables ["wirelesslan", "wifimesh", "wiredlan", "cellularmodule"]
   *                 wifi: [ // only wifi accept array of configs
   *                     {
   *                     ssid: string required
   *                     pass: string required
   *                     ip: string (static IP)
   *                     netmask: string (subnet mask)
   *                     gw: string (default gateway)
   *                     dns: string (dns server)
   *                     e_n: string (WPA2 Enterprise Username)
   *                     e_p: string (WPA2 Enterprise Password)
   *                     e_i: string (WPA2 Enterprise Identity/Anonymous ID)
   *                     addr: string (WPA2 Proxy address)
   *                     port: string (WPA2 Proxy port)
   *                     }
   *                 ]
   *                 wifimesh: {
   *                     ssid: string required
   *                     pass: string required
   *                     ip: string (static IP)
   *                     netmask: string (subnet mask)
   *                     gw: string (default gateway)
   *                     dns: string (dns server)
   *                     e_n: string (WPA2 Enterprise Username)
   *                     e_p: string (WPA2 Enterprise Password)
   *                     e_i: string (WPA2 Enterprise Identity/Anonymous ID)
   *                     addr: string (WPA2 Proxy address)
   *                     port: string (WPA2 Proxy port)
   *                     meshid: string (MESH ID)
   *                 }
   *                 ether: {
   *                     ip: string (static IP)
   *                     netmask: string (subnet mask)
   *                     gw: string (default gateway)
   *                     dns: string (dns server)
   *                     addr: string (WPA2 Proxy address)
   *                     port: string (WPA2 Proxy port)
   *                 }
   *                 cellular: {
   *                     apn: string required
   *                     id: string required
   *                     password: string required
   *                 }
   */
  networkConfigs: Scalars['String'];
  /** App ID. This field will be null when app is not selected. */
  appId?: Maybe<Scalars['Int']>;
  /** String representation of app config object. Will be empty object when no app is selected. */
  appConfigs: Scalars['String'];
  /** When no description is set, this field will be an empty string. */
  description: Scalars['String'];
  /** 0: not operated yet, 1: in progress, 2: finished */
  status: Scalars['Int'];
};

/** Operation setting edge. */
export type OperationSettingEdge = {
  __typename?: 'operationSettingEdge';
  /** Cursor. */
  node?: Maybe<OperationSetting>;
  /** Operation result of the specific setting ID if any. */
  operationResult?: Maybe<OperationResultForOperationSetting>;
};

/** Connection of operation settings */
export type OperationSettingsConnection = {
  __typename?: 'operationSettingsConnection';
  /** Total count of operation settings edges */
  totalCount: Scalars['Int'];
  /** Edges. */
  edges: Array<Maybe<OperationSettingEdge>>;
};

/** Connection of operations. */
export type OperationsConnection = {
  __typename?: 'operationsConnection';
  /** Edges. */
  edges: Array<Maybe<OperationEdge>>;
};

/** OS Information. Return value may different in user. */
export type Os = {
  __typename?: 'os';
  /** version string */
  version: Scalars['String'];
  /** Binary URL for application */
  app_url: Scalars['String'];
  /** Binary URL for bootloader */
  bootloader_url: Scalars['String'];
  /** Binary URL for partition table */
  partition_url: Scalars['String'];
};

/** Pagenation */
export type PageInfo = {
  __typename?: 'pageInfo';
  /** result has next page */
  hasNextPage: Scalars['Boolean'];
  /** result has previous page */
  hasPreviousPage: Scalars['Boolean'];
};

export type RemoveOperationResultResponse = {
  __typename?: 'removeOperationResultResponse';
  removed?: Maybe<Scalars['Boolean']>;
};


export type UpdateStatusOperationSettingResult = {
  __typename?: 'updateStatusOperationSettingResult';
  updated: Scalars['Boolean'];
};

/** User information */
export type User = {
  __typename?: 'user';
  /** Unique Identifier */
  id: Scalars['ID'];
  /** user name */
  name?: Maybe<Scalars['String']>;
  /** email address */
  email?: Maybe<Scalars['String']>;
  /** url for user icon */
  picture?: Maybe<Scalars['String']>;
  /** User Plan on obniz.com */
  plan: Scalars['String'];
  /** Credit Point user has */
  credit: Scalars['String'];
  /** Installed time */
  createdAt: Scalars['Date'];
};

/** WebApp object. This contains webapp information which created on obniz.com as WebApp */
export type Webapp = {
  __typename?: 'webapp';
  /** Unique Identifier of webapp */
  id: Scalars['ID'];
  /** English Title of WebApp */
  title: Scalars['String'];
  /** English Description */
  short_body: Scalars['String'];
  /** Type of WebApp. */
  type: Scalars['String'];
  /** Current Status on obniz.com Explore App */
  store_status: Scalars['String'];
  /** Query Installed Apps for WebApp. */
  installs?: Maybe<InstallConnection>;
};


/** WebApp object. This contains webapp information which created on obniz.com as WebApp */
export type WebappInstallsArgs = {
  first?: Maybe<Scalars['first']>;
  skip?: Maybe<Scalars['skip']>;
};

export type CreateDeviceMutationVariables = Exact<{
  createDeviceDevice: DeviceCreateInput;
}>;


export type CreateDeviceMutation = (
  { __typename?: 'Mutation' }
  & { createDevice?: Maybe<(
    { __typename?: 'device' }
    & Pick<Device, 'id' | 'createdAt' | 'devicekey' | 'region' | 'hardware' | 'description'>
  )> }
);

export type GetDeviceByIdQueryVariables = Exact<{
  deviceId?: Maybe<Scalars['String']>;
}>;


export type GetDeviceByIdQuery = (
  { __typename?: 'Query' }
  & { devices?: Maybe<(
    { __typename?: 'deviceConnection' }
    & Pick<DeviceConnection, 'totalCount'>
    & { pageInfo: (
      { __typename?: 'pageInfo' }
      & Pick<PageInfo, 'hasNextPage' | 'hasPreviousPage'>
    ), edges: Array<Maybe<(
      { __typename?: 'deviceEdge' }
      & { node?: Maybe<(
        { __typename?: 'device' }
        & Pick<Device, 'id' | 'createdAt' | 'description' | 'devicekey' | 'hardware' | 'status'>
      )> }
    )>> }
  )> }
);

export type GetOperationQueryVariables = Exact<{
  operationsId?: Maybe<Scalars['Int']>;
}>;


export type GetOperationQuery = (
  { __typename?: 'Query' }
  & { operations?: Maybe<(
    { __typename?: 'operationsConnection' }
    & { edges: Array<Maybe<(
      { __typename?: 'operationEdge' }
      & Pick<OperationEdge, 'facilityName' | 'amountExpectedDevices' | 'amountOperatedDevices' | 'amountReport' | 'errorLevelReport'>
      & { node?: Maybe<(
        { __typename?: 'operation' }
        & Pick<Operation, 'name' | 'id' | 'facilityId' | 'completionLevel' | 'needPicEvidence' | 'needLocationNote' | 'dueDate' | 'operationKey' | 'createdAt'>
      )> }
    )>> }
  )> }
);

export type GetOperationsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetOperationsQuery = (
  { __typename?: 'Query' }
  & { operations?: Maybe<(
    { __typename?: 'operationsConnection' }
    & { edges: Array<Maybe<(
      { __typename?: 'operationEdge' }
      & Pick<OperationEdge, 'facilityName' | 'amountExpectedDevices' | 'amountOperatedDevices' | 'amountReport' | 'errorLevelReport'>
      & { node?: Maybe<(
        { __typename?: 'operation' }
        & Pick<Operation, 'name' | 'id' | 'facilityId' | 'completionLevel' | 'needPicEvidence' | 'needLocationNote' | 'dueDate' | 'operationKey' | 'createdAt'>
      )> }
    )>> }
  )> }
);

export type CurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserQuery = (
  { __typename?: 'Query' }
  & { user?: Maybe<(
    { __typename?: 'user' }
    & Pick<User, 'id' | 'name' | 'email'>
  )> }
);


export const CreateDeviceDocument = gql`
    mutation createDevice($createDeviceDevice: deviceCreateInput!) {
  createDevice(device: $createDeviceDevice) {
    id
    createdAt
    devicekey
    region
    hardware
    description
  }
}
    `;
export const GetDeviceByIdDocument = gql`
    query getDeviceById($deviceId: String) {
  devices(id: $deviceId) {
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
    edges {
      node {
        id
        createdAt
        description
        devicekey
        hardware
        status
      }
    }
  }
}
    `;
export const GetOperationDocument = gql`
    query getOperation($operationsId: Int) {
  operations(id: $operationsId) {
    edges {
      node {
        name
        id
        facilityId
        completionLevel
        needPicEvidence
        needLocationNote
        dueDate
        operationKey
        createdAt
      }
      facilityName
      amountExpectedDevices
      amountOperatedDevices
      amountReport
      errorLevelReport
    }
  }
}
    `;
export const GetOperationsDocument = gql`
    query getOperations {
  operations {
    edges {
      node {
        name
        id
        facilityId
        completionLevel
        needPicEvidence
        needLocationNote
        dueDate
        operationKey
        createdAt
      }
      facilityName
      amountExpectedDevices
      amountOperatedDevices
      amountReport
      errorLevelReport
    }
  }
}
    `;
export const CurrentUserDocument = gql`
    query currentUser {
  user {
    id
    name
    email
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: () => Promise<T>) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = sdkFunction => sdkFunction();
export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    createDevice(variables: CreateDeviceMutationVariables): Promise<CreateDeviceMutation> {
      return withWrapper(() => client.request<CreateDeviceMutation>(print(CreateDeviceDocument), variables));
    },
    getDeviceById(variables?: GetDeviceByIdQueryVariables): Promise<GetDeviceByIdQuery> {
      return withWrapper(() => client.request<GetDeviceByIdQuery>(print(GetDeviceByIdDocument), variables));
    },
    getOperation(variables?: GetOperationQueryVariables): Promise<GetOperationQuery> {
      return withWrapper(() => client.request<GetOperationQuery>(print(GetOperationDocument), variables));
    },
    getOperations(variables?: GetOperationsQueryVariables): Promise<GetOperationsQuery> {
      return withWrapper(() => client.request<GetOperationsQuery>(print(GetOperationsDocument), variables));
    },
    currentUser(variables?: CurrentUserQueryVariables): Promise<CurrentUserQuery> {
      return withWrapper(() => client.request<CurrentUserQuery>(print(CurrentUserDocument), variables));
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;
