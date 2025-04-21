export interface ConnectedDevice {
  port: string;
  ip: string;
  device: string;
}

export interface Port {
  port: string;
  status: string;
  vlan: string;
  connected_to: ConnectedDevice;
}
s;

export interface Vlan {
  id: number;
  name: string;
  status: string;
  ports: string[];
  ip: string;
}

export interface Device {
  id: string;

  name: string;
  ip: string;
  ports: Port[];
  vlans: Vlan[];
}

export type SortField = "name" | "ip";
export type SortOrder = "asc" | "desc";
