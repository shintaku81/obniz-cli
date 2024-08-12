import { GraphQLClient } from "graphql-request";
import { print } from "graphql";
import { gql } from "graphql-tag";
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
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

export type AppRelatedDataOfCreateAppLogsInput = {
  logs: Array<Maybe<AppLogList>>;
};

export type DeviceDeleteAccessTokenInput = {
  obniz?: Maybe<DeviceDeleteAccessTokenInputDevice>;
};

export type DeviceDeleteAccessTokenInputDevice = {
  /** obnizID */
  id: Scalars["String"];
};

export type DeviceGenerateAccessTokenInput = {
  obniz?: Maybe<DeviceGenerateAccessTokenInputDevice>;
};

export type DeviceGenerateAccessTokenInputDevice = {
  /** obnizID */
  id: Scalars["String"];
};

/** Root of api.obniz.com graphql api endpoint mutations */
export type Mutation = {
  __typename?: "Mutation";
  /**
   * Create New Event
   * @deprecated This is legacy feature, no more maintained and will be thrown away in the near future.
   */
  createEvent?: Maybe<Event>;
  /**
   * Update Exist Event
   * @deprecated This is legacy feature, no more maintained and will be thrown away in the near future.
   */
  updateEvent?: Maybe<Event>;
  /**
   * Delete Exist Event
   * @deprecated This is legacy feature, no more maintained and will be thrown away in the near future.
   */
  deleteEvent: Scalars["ID"];
  /** Create New Device */
  createDevice?: Maybe<Device>;
  /** Get device ownership with 'registrateUrl'. */
  registrateDevice?: Maybe<Device>;
  /** Update Device */
  updateDevice?: Maybe<Device>;
  /** Generate Device Access Token */
  generateDeviceAccessToken?: Maybe<Device>;
  /** Delete Device Access Token */
  deleteDeviceAccessToken?: Maybe<Device>;
  /** Update install settings of the device. */
  updateDeviceSettingsForInstalledApp?: Maybe<Device>;
  /** Install App To Device */
  installApp?: Maybe<Device>;
  /** Uninstall the app from the device. */
  uninstallApp?: Maybe<Device>;
  /**
   * Create app log
   * @deprecated We now provide more flexible createAppLogs API by which you can send multiple logs in a single request and also set timestamps too.
   */
  createAppLog?: Maybe<AppLog>;
  /** Create multiple app logs. */
  createAppLogs?: Maybe<Array<Maybe<AppLog>>>;
  /** Create app status */
  createAppStatus?: Maybe<AppStatus>;
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
  id: Scalars["ID"];
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
export type MutationCreateAppLogArgs = {
  input: CreateAppLogInput;
};

/** Root of api.obniz.com graphql api endpoint mutations */
export type MutationCreateAppLogsArgs = {
  input: CreateAppLogsInput;
};

/** Root of api.obniz.com graphql api endpoint mutations */
export type MutationCreateAppStatusArgs = {
  input: CreateAppStatusInput;
};

/** Root of api.obniz.com graphql api endpoint mutations */
export type MutationUpdateStatusOperationSettingArgs = {
  operationSettingId: Scalars["ID"];
};

/** Root of api.obniz.com graphql api endpoint mutations */
export type MutationCreateOperationResultArgs = {
  operationResult: CreateOperationResultInput;
};

/** Root of api.obniz.com graphql api endpoint mutations */
export type MutationRemoveOperationResultArgs = {
  operationSettingId: Scalars["ID"];
};

/** Root of api.obniz.com graphql api endpoint queries */
export type Query = {
  __typename?: "Query";
  /**
   * Information of webapp specified by given app token.
   * @deprecated This is deprecated alias query for 'app' query. Use 'app' query instead.
   */
  webapp?: Maybe<Webapp>;
  /** Information of app specified by given app token. */
  app?: Maybe<App>;
  /** User information which is authorized for current Access Token. */
  user?: Maybe<User>;
  /** Information of obniz devices that the request user owns. */
  devices?: Maybe<DeviceConnection>;
  /**
   * User Configured Serverless Events
   * @deprecated This is legacy feature, no more maintained and will be thrown away in the near future.
   */
  events?: Maybe<EventConnection>;
  /** Registrated obniz hardware list on obniz Cloud */
  hardwares: Array<Maybe<Hardware>>;
  /** obnizOS versions on obniz Cloud for queried hardware */
  os: Array<Maybe<Os>>;
  /** Query event historys of Hosted App. */
  appEvents?: Maybe<AppEvents>;
  operations?: Maybe<OperationsConnection>;
  operationSettings?: Maybe<OperationSettingsConnection>;
  operationResults?: Maybe<OperationResultsConnection>;
  /** Token permission. */
  token?: Maybe<Token>;
  /** Get pipeline sensor logs for the specified obniz. */
  pipelineSensorLogs?: Maybe<Array<Maybe<PipelineSensorLog>>>;
  pipelineConfig?: Maybe<PipelineConfig>;
  device?: Maybe<DeviceNoAuthRequired>;
};

/** Root of api.obniz.com graphql api endpoint queries */
export type QueryDevicesArgs = {
  first?: Maybe<Scalars["first"]>;
  skip?: Maybe<Scalars["skip"]>;
  id?: Maybe<Scalars["String"]>;
  hw?: Maybe<Scalars["String"]>;
  app?: Maybe<Scalars["Int"]>;
  status?: Maybe<Scalars["String"]>;
  created?: Maybe<Scalars["String"]>;
  serialCode?: Maybe<Scalars["String"]>;
  sort?: Maybe<Scalars["String"]>;
  order?: Maybe<Scalars["String"]>;
};

/** Root of api.obniz.com graphql api endpoint queries */
export type QueryEventsArgs = {
  first?: Maybe<Scalars["first"]>;
  skip?: Maybe<Scalars["skip"]>;
};

/** Root of api.obniz.com graphql api endpoint queries */
export type QueryOsArgs = {
  hardware: Scalars["String"];
};

/** Root of api.obniz.com graphql api endpoint queries */
export type QueryAppEventsArgs = {
  first?: Maybe<Scalars["first"]>;
  skip?: Maybe<Scalars["skip"]>;
};

/** Root of api.obniz.com graphql api endpoint queries */
export type QueryOperationsArgs = {
  id?: Maybe<Scalars["Int"]>;
  facilityName?: Maybe<Scalars["String"]>;
};

/** Root of api.obniz.com graphql api endpoint queries */
export type QueryOperationSettingsArgs = {
  first?: Maybe<Scalars["first"]>;
  operationId?: Maybe<Scalars["ID"]>;
  status?: Maybe<Scalars["Int"]>;
};

/** Root of api.obniz.com graphql api endpoint queries */
export type QueryOperationResultsArgs = {
  first?: Maybe<Scalars["first"]>;
  operationId?: Maybe<Scalars["ID"]>;
  operationSettingId?: Maybe<Scalars["ID"]>;
};

/** Root of api.obniz.com graphql api endpoint queries */
export type QueryPipelineSensorLogsArgs = {
  obnizId: Scalars["ID"];
  limitForSensorLogs?: Maybe<Scalars["Int"]>;
  targetSensorUuids?: Maybe<Array<Maybe<Scalars["String"]>>>;
};

/** Root of api.obniz.com graphql api endpoint queries */
export type QueryPipelineConfigArgs = {
  obnizId: Scalars["ID"];
};

/** Root of api.obniz.com graphql api endpoint queries */
export type QueryDeviceArgs = {
  serialUrl?: Maybe<Scalars["String"]>;
};

/** App object. This contains app information which created on obniz.com as App */
export type App = {
  __typename?: "app";
  /** Unique Identifier of app */
  id: Scalars["ID"];
  /** English Title of app */
  title: Scalars["String"];
  /** English Description */
  short_body: Scalars["String"];
  /** Type of app. */
  type: Scalars["String"];
  /** Current Status on app store */
  store_status: Scalars["String"];
  /** Query Installs for an App. */
  installs?: Maybe<AppInstallConnection>;
};

/** App object. This contains app information which created on obniz.com as App */
export type AppInstallsArgs = {
  first?: Maybe<Scalars["first"]>;
  skip?: Maybe<Scalars["skip"]>;
};

export type AppConfigInput = {
  key: Scalars["String"];
  value: Scalars["String"];
};

/** This contains information that was sent by the webhook in the past. */
export type AppEvent = {
  __typename?: "appEvent";
  /** Unique Identifier of webhook for webapp */
  id: Scalars["Int"];
  /** The date and time the webhook was sent. */
  createdAt: Scalars["String"];
  /** Type of event, */
  type: Scalars["String"];
  app: AppEventApp;
  payload: AppEventPayload;
};

export type AppEventApp = {
  __typename?: "appEventApp";
  /** Unique Identifier of webapp */
  id: Scalars["ID"];
};

/** Contains any of the following objects. */
export type AppEventPayload = {
  __typename?: "appEventPayload";
  user?: Maybe<User>;
  device?: Maybe<Device>;
};

/** Connection of Device */
export type AppEvents = {
  __typename?: "appEvents";
  /** Total Count of device edges */
  totalCount: Scalars["Int"];
  /** Page Information */
  pageInfo: PageInfo;
  /** Events */
  events: Array<Maybe<AppEvent>>;
};

/** Connection of Install */
export type AppInstallConnection = {
  __typename?: "appInstallConnection";
  /** Total Count of device edges */
  totalCount: Scalars["Int"];
  /** Page Information */
  pageInfo: PageInfo;
  /** Edges */
  edges: Array<Maybe<AppInstallEdge>>;
};

/** Install Edge */
export type AppInstallEdge = {
  __typename?: "appInstallEdge";
  /** Cursor */
  node?: Maybe<Installed_Device>;
};

export type AppInstallInput = {
  obniz: AppInstallInputDevice;
  app: AppInstallInputApp;
};

export type AppInstallInputApp = {
  /** appID */
  id: Scalars["ID"];
  config: Array<AppConfigInput>;
};

export type AppInstallInputDevice = {
  /** obnizID */
  id: Scalars["ID"];
};

/** App log */
export type AppLog = {
  __typename?: "appLog";
  /** Unique ID */
  id: Scalars["ID"];
  /** obniz ID */
  obnizId: Scalars["ID"];
  /** The app log is targetted at an app having this ID */
  appId: Scalars["ID"];
  /** String representation of json including log information. */
  logJson: Scalars["String"];
  /** Log level of the app log. Possibilitties are either 'info' or 'error' */
  level: Scalars["String"];
  /** Created at */
  createdAt: Scalars["Date"];
};

export type AppLogList = {
  /** The string must be json format and include a key 'message'. e.g. '{ 'message': 'log message' }' */
  logJson: Scalars["String"];
  /** log level: info or error */
  level: Scalars["String"];
  /** Cassandra timeuuid string. If the value is omitted, a time when the API is called is used as a timestamp. */
  timeuuid: Scalars["String"];
};

/** App status */
export type AppStatus = {
  __typename?: "appStatus";
  /** Unique ID */
  id: Scalars["ID"];
  /** obniz ID */
  obnizId: Scalars["ID"];
  result?: Maybe<AppStatusResult>;
  /** created at */
  createdAt?: Maybe<Scalars["Date"]>;
};

export type AppStatusResult = {
  __typename?: "appStatusResult";
  /** app status */
  status: Scalars["String"];
  /** text detailing the app status */
  text: Scalars["String"];
};

export type AppUninstallInput = {
  obniz?: Maybe<AppUninstallInputDevice>;
};

export type AppUninstallInputDevice = {
  /** obnizID */
  id: Scalars["String"];
};

/** Information of currently connected cellullar network */
export type Cellular = {
  __typename?: "cellular";
  /** CNUM: Phone Number */
  cnum?: Maybe<Scalars["String"]>;
  /** ICCID: Sim Card Identifier */
  iccid?: Maybe<Scalars["String"]>;
  /** IMEI: Modem Identifier */
  imei?: Maybe<Scalars["String"]>;
  /** IMSI: Mobile subscription identity */
  imsi?: Maybe<Scalars["String"]>;
  /** Current RSSI for connected Network. RSSI is mesured only on connection timing. ex ) -40 */
  rssi?: Maybe<Scalars["Int"]>;
};

/** Information of currently connected network  */
export type ConnectedNetwork = {
  __typename?: "connectedNetwork";
  /** The time device become online on the cloud */
  online_at: Scalars["Date"];
  /** Current connected network type. Defined in setting json. ex) wirelesslan */
  net: Scalars["String"];
  /** Local IP If exist. ex) 192.168.0.100 */
  local_ip?: Maybe<Scalars["String"]>;
  /** Global IP if exist. ex) 201.200.199.198 */
  global_ip?: Maybe<Scalars["String"]>;
  /** Wi-Fi information if network type is wirelesslan */
  wifi?: Maybe<Wifi>;
  /** Wi-Fi Mesh information if network type is wifimesh */
  wifimesh?: Maybe<Wifimesh>;
  /** cellular information if network type is cellular */
  cellular?: Maybe<Cellular>;
};

export type CreateAppLogInput = {
  obniz: CreateAppLogInputDevice;
  app: CreateAppLogInputApp;
};

export type CreateAppLogInputApp = {
  /** The string must be json format and include a key 'message'. e.g. '{ 'message': 'log message' }' */
  logJson: Scalars["String"];
  /** log level: info or error */
  level: Scalars["String"];
};

export type CreateAppLogInputDevice = {
  /** obnizID */
  id: Scalars["ID"];
};

export type CreateAppLogsInput = {
  obniz: ObnizRelatedDataOfCreateAppLogsInput;
  app: AppRelatedDataOfCreateAppLogsInput;
};

export type CreateAppStatusInput = {
  obniz: CreateAppStatusInputDevice;
  result: CreateAppStatusInputApp;
};

export type CreateAppStatusInputApp = {
  /** status */
  status: Scalars["String"];
  /** text */
  text: Scalars["String"];
};

export type CreateAppStatusInputDevice = {
  /** obnizID */
  id: Scalars["ID"];
};

export type CreateOperationResultInput = {
  /** Operation setting ID. */
  operationSettingId: Scalars["ID"];
  /** Obniz ID. Format can be both xxxx-xxxx and xxxxxxxx. */
  obnizId?: Maybe<Scalars["String"]>;
  /** Time when a device setting is written onto an obniz. */
  successfullyWrittenAt?: Maybe<Scalars["Date"]>;
  /** Time when an obniz became online. */
  becomeOnlineAt?: Maybe<Scalars["Date"]>;
  /** Binary data of operation picture. */
  picBinary?: Maybe<Scalars["Upload"]>;
  /** Location note. */
  locationNote?: Maybe<Scalars["String"]>;
  /**
   * Type of operation error. Possibities:
   *
   *             - No error -> 0
   *             - Gateway not found -> 1
   *             - Found multi gateway -> 2
   *             - Cannot connect to gateway -> 3
   *             - Gateway cannot connect the wifi -> 4
   *
   *             - Invalid ssid or password -> 5
   *             - Cannot resolve dns -> 6
   *             - Cannot go out to the internet -> 7
   *             - Cannot communicate with gateway -> 8
   */
  typeError: Scalars["Int"];
};

/** Device information */
export type Device = {
  __typename?: "device";
  /** Unique Identifier like "0000-0000" */
  id: Scalars["ID"];
  /** Access Token */
  access_token?: Maybe<Scalars["String"]>;
  /**
   * Description
   *
   *       Same value are exist on metadata.description
   */
  description: Scalars["String"];
  /**
   * User Defined Metadata JSON string
   *
   *       Useful for labeling device location or attached machine.
   */
  metadata: Scalars["String"];
  /**
   * DeviceKey
   *
   *       String representation of DeviceKey which installed or to be installed on the device.
   */
  devicekey?: Maybe<Scalars["String"]>;
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
   *
   *       'blelte_gw2': obniz BLE/LTE Gateway (Cat.4)
   *       'blewifi_gw2': obniz BLE/Wi-Fi Gateway Gen2.0
   */
  hardware: Scalars["String"];
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
   *
   *       'blewifi_gw2': obnizOS for obniz BLE/Wi-Fi Gateway Gen2.0
   *       'blelte_gw2': obnizOS for obniz BLE/LTE Gateway (Cat.4)
   */
  os: Scalars["String"];
  /** Last time recognized os version like '1.0.0' */
  osVersion: Scalars["String"];
  /**
   * Server Region
   *
   *       'jp': Japan(East Asia)
   *
   *       'us': United States of America(West-America)
   */
  region: Scalars["String"];
  /**
   * Status
   *
   *       'active': activated
   *
   *       'inactive': inactivated
   */
  status: Scalars["String"];
  /** Webhook event Destination URL. If not exist, then webhookUrl of the account will be used. */
  webhookUrl?: Maybe<Scalars["String"]>;
  /** IMSI of LTE device. This will be recognized when LTE device was connected at least onece. */
  imsi?: Maybe<Scalars["String"]>;
  /** Online Check Interval in minutes. By default it is null and automatic interval under 1 minutes. */
  pingInterval?: Maybe<Scalars["Int"]>;
  /** The time of device manufactured */
  createdAt: Scalars["Date"];
  /** The time of device registration to an account */
  registeredAt?: Maybe<Scalars["Date"]>;
  /** Device Live Information. */
  deviceLiveInfo?: Maybe<DeviceLiveInfo>;
  /** Device SerialCode */
  serialCode?: Maybe<SerialCode>;
  /** User information which is authorized for current Access Token. */
  user?: Maybe<User>;
  /** JSON Representation of Installed app configration */
  configs: Scalars["String"];
};

/** Connection of Device */
export type DeviceConnection = {
  __typename?: "deviceConnection";
  /** Total Count of device edges */
  totalCount: Scalars["Int"];
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
  hardware: Scalars["String"];
  /**
   * Server Region
   *
   *       'jp': Japan(East Asia)
   *
   *       'us': United States of America(West-America)
   */
  region?: Maybe<Scalars["String"]>;
  /**
   * Description
   *
   *       User Defined Metadata. Useful for labeling device location or attached machine.
   */
  description?: Maybe<Scalars["String"]>;
  /**
   * Description
   *
   *       Option for manufacturer
   */
  serialdata?: Maybe<Scalars["String"]>;
};

/** Device Edge */
export type DeviceEdge = {
  __typename?: "deviceEdge";
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
  id: Scalars["ID"];
};

/** Device Live Information. */
export type DeviceLiveInfo = {
  __typename?: "deviceLiveInfo";
  /** Live Information. Device is Online or Offline */
  isOnline: Scalars["Boolean"];
  /** The time device become online on the cloud */
  onlineAt?: Maybe<Scalars["Date"]>;
  /** The time device become offline on the cloud */
  offlineAt?: Maybe<Scalars["Date"]>;
  /** Live Information. Connected Wi-Fi and RSSI and other related. */
  connectedNetwork?: Maybe<ConnectedNetwork>;
};

export type DeviceNoAuthRequired = {
  __typename?: "deviceNoAuthRequired";
  /** Format is like XXXX-XXXX */
  id: Scalars["String"];
};

export type DeviceRegistrateInput = {
  /** It can be obtained from the QR Code on the device. */
  registrateUrl: Scalars["String"];
};

export type DeviceUpdateInput = {
  /** obnizID */
  id: Scalars["ID"];
  /**
   * Server Region
   *
   *       'jp': Japan(East Asia)
   *
   *       'us': United States of America(West-America)
   */
  region?: Maybe<Scalars["String"]>;
  /**
   * Use Defined Description
   *
   *       Same value are exist on metadata.description
   */
  description?: Maybe<Scalars["String"]>;
  /**
   * User Defined Metadata key-value JSON string
   *
   *       Only key:string and value:string is accepted
   *       Useful for labeling device location or attached machine.
   */
  metadata?: Maybe<Scalars["String"]>;
  /**
   * Status
   *
   *       'active': activated
   *
   *       'inactive': inactivated
   */
  status?: Maybe<Scalars["String"]>;
  /** Online Check Interval in milli seconds. By default it is null and automatic interval under 1 minutes. */
  pingInterval?: Maybe<Scalars["Int"]>;
  /** Detection period between going offline and alerting. (seconds) */
  offlineDetectDuration?: Maybe<Scalars["Int"]>;
  /** URL to be notified when offline, starting with `http://` or `https://` or `mailto:`. */
  webhookUrl?: Maybe<Scalars["String"]>;
};

/** ServerlessEvent */
export type Event = {
  __typename?: "event";
  /** Unique Identifier */
  id: Scalars["ID"];
  /** User named */
  name: Scalars["String"];
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
  trigger: Scalars["String"];
  /**
   * Action uri
   *
   *       '{filename_in_repo}':
   *
   *       'webapp://{install_id}/run': installed webapp
   */
  action: Scalars["String"];
  /** webhook Endpoint if trigger is webhook. */
  webhookUri?: Maybe<Scalars["String"]>;
  /** Created time */
  createdAt: Scalars["Date"];
};

/** Connection of Event */
export type EventConnection = {
  __typename?: "eventConnection";
  /** Total Count of device edges */
  totalCount: Scalars["Int"];
  /** Page Information */
  pageInfo: PageInfo;
  /** Edges */
  edges: Array<Maybe<EventEdge>>;
};

export type EventCreateInput = {
  /** The Event name */
  name: Scalars["String"];
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
  trigger: Scalars["String"];
  /**
   * Action uri
   *
   *       '{filename_in_repo}':
   *
   *       'webapp://{install_id}/run': installed webapp
   */
  action: Scalars["String"];
};

/** Event Edge */
export type EventEdge = {
  __typename?: "eventEdge";
  /** Cursor */
  node?: Maybe<Event>;
};

export type EventUpdateInput = {
  /** Unique Identifier */
  id: Scalars["ID"];
  /** The Event name */
  name: Scalars["String"];
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
  trigger: Scalars["String"];
  /**
   * Action uri
   *       '{filename_in_repo}':
   *       'webapp://{install_id}/run': installed webapp
   */
  action: Scalars["String"];
};

/** Hardware Information. This indicate related os information for each hardware */
export type Hardware = {
  __typename?: "hardware";
  /** Hardware Identifier  */
  hardware: Scalars["String"];
  /** OS identifier for hardware. */
  os: Scalars["String"];
};

/** Installed WebApp object. This contains user installed webapp configration */
export type Install = {
  __typename?: "install";
  /** Unique Identifier of install */
  id: Scalars["ID"];
  /** User information which is authorized for current Access Token. */
  user?: Maybe<User>;
  /** Installed time */
  createdAt: Scalars["Date"];
  /** Updated time */
  updatedAt: Scalars["Date"];
  /** JSON Representation of Installed app configration */
  configs: Scalars["String"];
};

/** Connection of Install */
export type InstallConnection = {
  __typename?: "installConnection";
  /** Total Count of device edges */
  totalCount: Scalars["Int"];
  /** Page Information */
  pageInfo: PageInfo;
  /** Edges */
  edges: Array<Maybe<InstallEdge>>;
};

/** Install Edge */
export type InstallEdge = {
  __typename?: "installEdge";
  /** Cursor */
  node?: Maybe<Install>;
};

/** Device information */
export type Installed_Device = {
  __typename?: "installed_device";
  /** Unique Identifier like "0000-0000" */
  id: Scalars["ID"];
  /** Access Token */
  access_token?: Maybe<Scalars["String"]>;
  /**
   * Description
   *
   *       Same value are exist on metadata.description
   */
  description: Scalars["String"];
  /**
   * User Defined Metadata JSON string
   *
   *       Useful for labeling device location or attached machine.
   */
  metadata: Scalars["String"];
  /**
   * DeviceKey
   *
   *       String representation of DeviceKey which installed or to be installed on the device.
   */
  devicekey?: Maybe<Scalars["String"]>;
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
   *
   *       'blelte_gw2': obniz BLE/LTE Gateway (Cat.4)
   *       'blewifi_gw2': obniz BLE/Wi-Fi Gateway Gen2.0
   */
  hardware: Scalars["String"];
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
   *
   *       'blewifi_gw2': obnizOS for obniz BLE/Wi-Fi Gateway Gen2.0
   *       'blelte_gw2': obnizOS for obniz BLE/LTE Gateway (Cat.4)
   */
  os: Scalars["String"];
  /** Last time recognized os version like '1.0.0' */
  osVersion: Scalars["String"];
  /**
   * Server Region
   *
   *       'jp': Japan(East Asia)
   *
   *       'us': United States of America(West-America)
   */
  region: Scalars["String"];
  /**
   * Status
   *
   *       'active': activated
   *
   *       'inactive': inactivated
   */
  status: Scalars["String"];
  /** Webhook event Destination URL. If not exist, then webhookUrl of the account will be used. */
  webhookUrl?: Maybe<Scalars["String"]>;
  /** IMSI of LTE device. This will be recognized when LTE device was connected at least onece. */
  imsi?: Maybe<Scalars["String"]>;
  /** Online Check Interval in minutes. By default it is null and automatic interval under 1 minutes. */
  pingInterval?: Maybe<Scalars["Int"]>;
  /** The time of device manufactured */
  createdAt: Scalars["Date"];
  /** The time of device registration to an account */
  registeredAt?: Maybe<Scalars["Date"]>;
  /** Device Live Information. */
  deviceLiveInfo?: Maybe<DeviceLiveInfo>;
  /** Device SerialCode */
  serialCode?: Maybe<SerialCode>;
  /** User information which is authorized for current Access Token. */
  user?: Maybe<User>;
  /** JSON Representation of Installed app configration */
  configs: Scalars["String"];
};

export type ObnizRelatedDataOfCreateAppLogsInput = {
  /** obnizID */
  id: Scalars["ID"];
};

/** operation. */
export type Operation = {
  __typename?: "operation";
  /** Unique identifier. */
  id: Scalars["ID"];
  /** Name of operation. */
  name: Scalars["String"];
  /** Facility ID which the operation targets at. */
  facilityId: Scalars["Int"];
  /** Criteria of completion. 0: written, 1: online. */
  completionLevel: Scalars["Int"];
  /** Evidence picture of completion is required if this param is true. */
  needPicEvidence: Scalars["Boolean"];
  /** Need to specify the exact device location if this param is true. */
  needLocationNote: Scalars["Boolean"];
  /** Time when the operation will be carried out. */
  dueDate?: Maybe<Scalars["Date"]>;
  /** Token that is going to be inclued in the operation URL on Android APP. */
  operationKey: Scalars["String"];
  /** Time when the facility created at */
  createdAt: Scalars["Date"];
};

/** operation edge */
export type OperationEdge = {
  __typename?: "operationEdge";
  /** Cursor. */
  node?: Maybe<Operation>;
  /** Facility name. */
  facilityName?: Maybe<Scalars["String"]>;
  /** The amount of devices that are going to be set. */
  amountExpectedDevices?: Maybe<Scalars["Int"]>;
  /** The amount of devices that have already been set. */
  amountOperatedDevices?: Maybe<Scalars["Int"]>;
  /** The amount of reports including both error and information. */
  amountReport?: Maybe<Scalars["Int"]>;
  /** Indicates whether or not error occurred and its error level if any. NoPrombelm Error. */
  errorLevelReport?: Maybe<Scalars["String"]>;
};

/** Operation result. */
export type OperationResult = {
  __typename?: "operationResult";
  /** Unique identifier. */
  id: Scalars["ID"];
  /** Operation Setting Id. */
  operationSettingId: Scalars["ID"];
  /** Indication Id. */
  indicationId: Scalars["String"];
  /** Obniz Id. */
  obnizId?: Maybe<Scalars["Int"]>;
  /** Time when operation setting has been written. */
  successfullyWrittenAt?: Maybe<Scalars["Date"]>;
  /** Time when a device became online. */
  becomeOnlineAt?: Maybe<Scalars["Date"]>;
  /** Url of evidence picture. */
  picUrl?: Maybe<Scalars["String"]>;
  /** Note about where a device has been set. */
  locationNote?: Maybe<Scalars["String"]>;
  /** Error code of operation failure. */
  typeError?: Maybe<Scalars["Int"]>;
};

/** Operation result edge. */
export type OperationResultEdge = {
  __typename?: "operationResultEdge";
  /** Cursor */
  node?: Maybe<OperationResult>;
};

/** Operation result. */
export type OperationResultForOperationSetting = {
  __typename?: "operationResultForOperationSetting";
  /** Obniz Id. */
  obnizId?: Maybe<Scalars["Int"]>;
  /** Time when operation setting has been written. */
  successfullyWrittenAt?: Maybe<Scalars["Date"]>;
  /** Time when a device became online. */
  becomeOnlineAt?: Maybe<Scalars["Date"]>;
  /** Url of evidence picture. */
  picUrl?: Maybe<Scalars["String"]>;
  /** Note about where a device has been set. */
  locationNote?: Maybe<Scalars["String"]>;
  /** Error code of operation failure. */
  typeError?: Maybe<Scalars["Int"]>;
};

/** Connection of operation results. */
export type OperationResultsConnection = {
  __typename?: "operationResultsConnection";
  /** Total count of operation results edges */
  totalCount: Scalars["Int"];
  /** Edges. */
  edges: Array<Maybe<OperationResultEdge>>;
};

/** Operation setting */
export type OperationSetting = {
  __typename?: "operationSetting";
  /** Unique identifier. */
  id: Scalars["ID"];
  /** Operation ID */
  operationId: Scalars["ID"];
  /** Indication ID. */
  indicationId: Scalars["String"];
  /** String representation of network config. Please see https://docs.obniz.com/ja/reference/obnizos-for-esp32/settings/setting-json */
  networkConfigs: Scalars["String"];
  /** App ID. This field will be null when app is not selected. */
  appId?: Maybe<Scalars["Int"]>;
  /** String representation of app config object. Will be empty object when no app is selected. */
  appConfigs: Scalars["String"];
  /** When no description is set, this field will be an empty string. */
  description: Scalars["String"];
  /** 0: not operated yet, 1: in progress, 2: finished */
  status: Scalars["Int"];
};

/** Operation setting edge. */
export type OperationSettingEdge = {
  __typename?: "operationSettingEdge";
  /** Cursor. */
  node?: Maybe<OperationSetting>;
  /** Operation result of the specific setting ID if any. */
  operationResult?: Maybe<OperationResultForOperationSetting>;
};

/** Connection of operation settings */
export type OperationSettingsConnection = {
  __typename?: "operationSettingsConnection";
  /** Total count of operation settings edges */
  totalCount: Scalars["Int"];
  /** Edges. */
  edges: Array<Maybe<OperationSettingEdge>>;
};

/** Connection of operations. */
export type OperationsConnection = {
  __typename?: "operationsConnection";
  /** Edges. */
  edges: Array<Maybe<OperationEdge>>;
};

/** OS Information. Return value may different in user. */
export type Os = {
  __typename?: "os";
  /** version string */
  version: Scalars["String"];
  /** Binary URL for application */
  app_url: Scalars["String"];
  /** Binary URL for bootloader */
  bootloader_url: Scalars["String"];
  /** Binary URL for partition table */
  partition_url: Scalars["String"];
  /** Information of publicity. */
  isPublic: Scalars["Boolean"];
};

/** Pagenation */
export type PageInfo = {
  __typename?: "pageInfo";
  /** result has next page */
  hasNextPage: Scalars["Boolean"];
  /** result has previous page */
  hasPreviousPage: Scalars["Boolean"];
};

export type PipelineConfig = {
  __typename?: "pipelineConfig";
  sensors: Array<Maybe<PipelineSensorConfig>>;
};

export type PipelineSensorConfig = {
  __typename?: "pipelineSensorConfig";
  name: Scalars["String"];
  type: Scalars["String"];
  uuid: Scalars["String"];
};

export type PipelineSensorLog = {
  __typename?: "pipelineSensorLog";
  event: Scalars["String"];
  sensor: Scalars["String"];
  uuid: Scalars["String"];
  macAddress: Scalars["String"];
  timestamp: Scalars["Date"];
};

export type RemoveOperationResultResponse = {
  __typename?: "removeOperationResultResponse";
  removed?: Maybe<Scalars["Boolean"]>;
};

/** Associated Serial Code */
export type SerialCode = {
  __typename?: "serialCode";
  /** Associated serial code string */
  serialCode?: Maybe<Scalars["String"]>;
};

/** Token object. This contains token information */
export type Token = {
  __typename?: "token";
  /** Token type. app_token / oauth / api_key */
  type: Scalars["String"];
  /** user permission. none / read / full  */
  user: Scalars["String"];
  /** device permission. none / read / full  */
  device: Scalars["String"];
  /** event permission. none / read / full  */
  event: Scalars["String"];
  /** facility permission. none / read / full  */
  facility: Scalars["String"];
  /** device_control permission. none / read / full  */
  device_control: Scalars["String"];
};

export type UpdateStatusOperationSettingResult = {
  __typename?: "updateStatusOperationSettingResult";
  updated: Scalars["Boolean"];
};

/** User information */
export type User = {
  __typename?: "user";
  /** Unique Identifier */
  id: Scalars["ID"];
  /** user name */
  name?: Maybe<Scalars["String"]>;
  /** email address */
  email?: Maybe<Scalars["String"]>;
  /** url for user icon */
  picture?: Maybe<Scalars["String"]>;
  /** User Plan on obniz.com */
  plan: Scalars["String"];
  /** Credit Point user has */
  credit: Scalars["String"];
  /** Installed time */
  createdAt: Scalars["Date"];
};

/** WebApp object. This contains webapp information which created on obniz.com as WebApp */
export type Webapp = {
  __typename?: "webapp";
  /** Unique Identifier of webapp */
  id: Scalars["ID"];
  /** English Title of WebApp */
  title: Scalars["String"];
  /** English Description */
  short_body: Scalars["String"];
  /** Type of WebApp. */
  type: Scalars["String"];
  /** Current Status on obniz.com Explore App */
  store_status: Scalars["String"];
  /** Query Installed Apps for WebApp. */
  installs?: Maybe<InstallConnection>;
};

/** WebApp object. This contains webapp information which created on obniz.com as WebApp */
export type WebappInstallsArgs = {
  first?: Maybe<Scalars["first"]>;
  skip?: Maybe<Scalars["skip"]>;
};

/** Information of currently connected wifi */
export type Wifi = {
  __typename?: "wifi";
  /** Current connected Accespoint SSID. ex) obniz-wifi */
  ssid?: Maybe<Scalars["String"]>;
  /** Current connected Accespoint MacAddress. ex) 0123456789AB */
  macAddress?: Maybe<Scalars["String"]>;
  /** Current RSSI for connected Accesspoint. RSSI is mesured only on connection timing. ex ) -40 */
  rssi?: Maybe<Scalars["Int"]>;
};

/** Information of currently connected wifimesh */
export type Wifimesh = {
  __typename?: "wifimesh";
  /** MESH ID of Currently joined MESH network. ex) 012345678901 */
  meshid?: Maybe<Scalars["String"]>;
  /** Id of parent node ex) 0000-0000 */
  parent_obniz_id?: Maybe<Scalars["ID"]>;
  /** Id of root node. Root is only connected to The AccessPoint ex) 0000-0000 */
  root_obniz_id?: Maybe<Scalars["ID"]>;
  /** Depth of MESH network. layer=1 is root node of a network. ex ) 1 */
  layer?: Maybe<Scalars["Int"]>;
  /** Current RSSI for connected Accesspoint. RSSI is mesured only on connection timing. ex ) -40 */
  rssi: Scalars["Int"];
};

export type CreateDeviceMutationVariables = Exact<{
  createDeviceDevice: DeviceCreateInput;
}>;

export type CreateDeviceMutation = { __typename?: "Mutation" } & {
  createDevice?: Maybe<
    { __typename?: "device" } & Pick<
      Device,
      "id" | "createdAt" | "devicekey" | "region" | "hardware" | "description"
    >
  >;
};

export type GetDeviceByIdQueryVariables = Exact<{
  deviceId?: Maybe<Scalars["String"]>;
}>;

export type GetDeviceByIdQuery = { __typename?: "Query" } & {
  devices?: Maybe<
    { __typename?: "deviceConnection" } & Pick<
      DeviceConnection,
      "totalCount"
    > & {
        pageInfo: { __typename?: "pageInfo" } & Pick<
          PageInfo,
          "hasNextPage" | "hasPreviousPage"
        >;
        edges: Array<
          Maybe<
            { __typename?: "deviceEdge" } & {
              node?: Maybe<
                { __typename?: "device" } & Pick<
                  Device,
                  | "id"
                  | "createdAt"
                  | "description"
                  | "devicekey"
                  | "hardware"
                  | "status"
                >
              >;
            }
          >
        >;
      }
  >;
};

export type CreateOperationResultMutationVariables = Exact<{
  createOperationResultOperationResult: CreateOperationResultInput;
}>;

export type CreateOperationResultMutation = { __typename?: "Mutation" } & {
  createOperationResult?: Maybe<
    { __typename?: "operationResult" } & Pick<
      OperationResult,
      | "id"
      | "operationSettingId"
      | "indicationId"
      | "obnizId"
      | "successfullyWrittenAt"
      | "becomeOnlineAt"
      | "picUrl"
      | "locationNote"
      | "typeError"
    >
  >;
};

export type GetOperationQueryVariables = Exact<{
  operationsId?: Maybe<Scalars["Int"]>;
}>;

export type GetOperationQuery = { __typename?: "Query" } & {
  operations?: Maybe<
    { __typename?: "operationsConnection" } & {
      edges: Array<
        Maybe<
          { __typename?: "operationEdge" } & Pick<
            OperationEdge,
            | "facilityName"
            | "amountExpectedDevices"
            | "amountOperatedDevices"
            | "amountReport"
            | "errorLevelReport"
          > & {
              node?: Maybe<
                { __typename?: "operation" } & Pick<
                  Operation,
                  | "name"
                  | "id"
                  | "facilityId"
                  | "completionLevel"
                  | "needPicEvidence"
                  | "needLocationNote"
                  | "dueDate"
                  | "operationKey"
                  | "createdAt"
                >
              >;
            }
        >
      >;
    }
  >;
};

export type GetOperationSettingsQueryVariables = Exact<{
  operationSettingsOperationId?: Maybe<Scalars["ID"]>;
}>;

export type GetOperationSettingsQuery = { __typename?: "Query" } & {
  operationSettings?: Maybe<
    { __typename?: "operationSettingsConnection" } & Pick<
      OperationSettingsConnection,
      "totalCount"
    > & {
        edges: Array<
          Maybe<
            { __typename?: "operationSettingEdge" } & {
              node?: Maybe<
                { __typename?: "operationSetting" } & Pick<
                  OperationSetting,
                  | "operationId"
                  | "id"
                  | "indicationId"
                  | "networkConfigs"
                  | "appId"
                  | "appConfigs"
                  | "description"
                  | "status"
                >
              >;
              operationResult?: Maybe<
                { __typename?: "operationResultForOperationSetting" } & Pick<
                  OperationResultForOperationSetting,
                  | "obnizId"
                  | "successfullyWrittenAt"
                  | "becomeOnlineAt"
                  | "picUrl"
                  | "locationNote"
                  | "typeError"
                >
              >;
            }
          >
        >;
      }
  >;
};

export type GetOperationsQueryVariables = Exact<{ [key: string]: never }>;

export type GetOperationsQuery = { __typename?: "Query" } & {
  operations?: Maybe<
    { __typename?: "operationsConnection" } & {
      edges: Array<
        Maybe<
          { __typename?: "operationEdge" } & Pick<
            OperationEdge,
            | "facilityName"
            | "amountExpectedDevices"
            | "amountOperatedDevices"
            | "amountReport"
            | "errorLevelReport"
          > & {
              node?: Maybe<
                { __typename?: "operation" } & Pick<
                  Operation,
                  | "name"
                  | "id"
                  | "facilityId"
                  | "completionLevel"
                  | "needPicEvidence"
                  | "needLocationNote"
                  | "dueDate"
                  | "operationKey"
                  | "createdAt"
                >
              >;
            }
        >
      >;
    }
  >;
};

export type RemoveOperationResultMutationVariables = Exact<{
  removeOperationResultOperationSettingId: Scalars["ID"];
}>;

export type RemoveOperationResultMutation = { __typename?: "Mutation" } & {
  removeOperationResult?: Maybe<
    { __typename?: "removeOperationResultResponse" } & Pick<
      RemoveOperationResultResponse,
      "removed"
    >
  >;
};

export type UpdateOperationSettingStatusMutationVariables = Exact<{
  updateStatusOperationSettingOperationSettingId: Scalars["ID"];
}>;

export type UpdateOperationSettingStatusMutation = {
  __typename?: "Mutation";
} & {
  updateStatusOperationSetting?: Maybe<
    { __typename?: "updateStatusOperationSettingResult" } & Pick<
      UpdateStatusOperationSettingResult,
      "updated"
    >
  >;
};

export type GetTokenPermissionQueryVariables = Exact<{ [key: string]: never }>;

export type GetTokenPermissionQuery = { __typename?: "Query" } & {
  token?: Maybe<
    { __typename?: "token" } & Pick<
      Token,
      "device" | "device_control" | "event" | "facility" | "type" | "user"
    >
  >;
};

export type CurrentUserQueryVariables = Exact<{ [key: string]: never }>;

export type CurrentUserQuery = { __typename?: "Query" } & {
  user?: Maybe<{ __typename?: "user" } & Pick<User, "id" | "name" | "email">>;
};

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
export const CreateOperationResultDocument = gql`
  mutation createOperationResult(
    $createOperationResultOperationResult: createOperationResultInput!
  ) {
    createOperationResult(
      operationResult: $createOperationResultOperationResult
    ) {
      id
      operationSettingId
      indicationId
      obnizId
      successfullyWrittenAt
      becomeOnlineAt
      picUrl
      locationNote
      typeError
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
export const GetOperationSettingsDocument = gql`
  query getOperationSettings($operationSettingsOperationId: ID) {
    operationSettings(operationId: $operationSettingsOperationId) {
      totalCount
      edges {
        node {
          operationId
          id
          indicationId
          networkConfigs
          appId
          appConfigs
          description
          status
        }
        operationResult {
          obnizId
          successfullyWrittenAt
          becomeOnlineAt
          picUrl
          locationNote
          typeError
        }
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
export const RemoveOperationResultDocument = gql`
  mutation removeOperationResult(
    $removeOperationResultOperationSettingId: ID!
  ) {
    removeOperationResult(
      operationSettingId: $removeOperationResultOperationSettingId
    ) {
      removed
    }
  }
`;
export const UpdateOperationSettingStatusDocument = gql`
  mutation updateOperationSettingStatus(
    $updateStatusOperationSettingOperationSettingId: ID!
  ) {
    updateStatusOperationSetting(
      operationSettingId: $updateStatusOperationSettingOperationSettingId
    ) {
      updated
    }
  }
`;
export const GetTokenPermissionDocument = gql`
  query getTokenPermission {
    token {
      device
      device_control
      event
      facility
      type
      user
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

const defaultWrapper: SdkFunctionWrapper = (sdkFunction) => sdkFunction();
export function getSdk(
  client: GraphQLClient,
  withWrapper: SdkFunctionWrapper = defaultWrapper,
) {
  return {
    createDevice(
      variables: CreateDeviceMutationVariables,
    ): Promise<CreateDeviceMutation> {
      return withWrapper(() =>
        client.request<CreateDeviceMutation>(
          print(CreateDeviceDocument),
          variables,
        ),
      );
    },
    getDeviceById(
      variables?: GetDeviceByIdQueryVariables,
    ): Promise<GetDeviceByIdQuery> {
      return withWrapper(() =>
        client.request<GetDeviceByIdQuery>(
          print(GetDeviceByIdDocument),
          variables,
        ),
      );
    },
    createOperationResult(
      variables: CreateOperationResultMutationVariables,
    ): Promise<CreateOperationResultMutation> {
      return withWrapper(() =>
        client.request<CreateOperationResultMutation>(
          print(CreateOperationResultDocument),
          variables,
        ),
      );
    },
    getOperation(
      variables?: GetOperationQueryVariables,
    ): Promise<GetOperationQuery> {
      return withWrapper(() =>
        client.request<GetOperationQuery>(
          print(GetOperationDocument),
          variables,
        ),
      );
    },
    getOperationSettings(
      variables?: GetOperationSettingsQueryVariables,
    ): Promise<GetOperationSettingsQuery> {
      return withWrapper(() =>
        client.request<GetOperationSettingsQuery>(
          print(GetOperationSettingsDocument),
          variables,
        ),
      );
    },
    getOperations(
      variables?: GetOperationsQueryVariables,
    ): Promise<GetOperationsQuery> {
      return withWrapper(() =>
        client.request<GetOperationsQuery>(
          print(GetOperationsDocument),
          variables,
        ),
      );
    },
    removeOperationResult(
      variables: RemoveOperationResultMutationVariables,
    ): Promise<RemoveOperationResultMutation> {
      return withWrapper(() =>
        client.request<RemoveOperationResultMutation>(
          print(RemoveOperationResultDocument),
          variables,
        ),
      );
    },
    updateOperationSettingStatus(
      variables: UpdateOperationSettingStatusMutationVariables,
    ): Promise<UpdateOperationSettingStatusMutation> {
      return withWrapper(() =>
        client.request<UpdateOperationSettingStatusMutation>(
          print(UpdateOperationSettingStatusDocument),
          variables,
        ),
      );
    },
    getTokenPermission(
      variables?: GetTokenPermissionQueryVariables,
    ): Promise<GetTokenPermissionQuery> {
      return withWrapper(() =>
        client.request<GetTokenPermissionQuery>(
          print(GetTokenPermissionDocument),
          variables,
        ),
      );
    },
    currentUser(
      variables?: CurrentUserQueryVariables,
    ): Promise<CurrentUserQuery> {
      return withWrapper(() =>
        client.request<CurrentUserQuery>(print(CurrentUserDocument), variables),
      );
    },
  };
}
export type Sdk = ReturnType<typeof getSdk>;
