import { Manager, ManagerOptions } from "socket.io-client";

export type SocketUrl = string;
export type Endpoint = string;

export class Socket {
  private apiUrl: SocketUrl;
  private manager: Manager;

  constructor(apiUrl: SocketUrl, opts?: Partial<ManagerOptions>) {
    this.apiUrl = apiUrl;
    this.manager = new Manager(this.apiUrl, opts);
  }

  connect() {
    return this.manager.connect();
  }

  socketEndpoint(endpoint: Endpoint) {
    return this.manager.socket(endpoint);
  }
}
