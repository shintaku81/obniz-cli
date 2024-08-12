export interface SerialPortSelect {
  portname: string;
  baud: number;
}

export interface ObnizOsSelect {
  hardware: string;
  version: string;
}

export interface SerialPortInfo {
  path: string;
  manufacturer: string | undefined;
  serialNumber: string | undefined;
  pnpId: string | undefined;
  locationId: string | undefined;
  productId: string | undefined;
  vendorId: string | undefined;
}
