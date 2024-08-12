export interface PortArgs {
  p?: string;
  port?: string;
  b?: string;
  baud?: string;
}

export interface FlashObnizOsArgs {
  h?: string;
  hardware?: string;
  v?: string;
  version?: string;
}

export interface FlashObnizIdDeviceKeyArgs {
  d?: string;
  devicekey?: string;
}

export interface FlashObnizIdWithCloudArgs {
  i?: string;
  id?: string;
  obniz_id?: string; //場所によってはobniz_idという名前で使われている。
  token?: string;
}

export type FlashObnizIdArgs = FlashObnizIdDeviceKeyArgs &
  FlashObnizIdWithCloudArgs & { skiprecovery?: string };

export interface SetObnizCloudConfigArgs {
  r?: string;
  region?: string;
  description?: string;
  serial_token?: string;
  bindtoken?: string;
}

export interface FlashConfigArgs {
  c?: string;
  config?: string;
}

export interface FlashOperationArgs {
  token?: string;
  operation?: string;
  indication?: string;
}
