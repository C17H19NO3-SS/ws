import Elysia from "elysia";
import chalk from "chalk";
import fs from "fs";
import {
  WebServer as Servers,
  type Status,
  type WebServer,
} from "./Interfaces/WebServer";
import type { ServerWebSocket } from "bun";
import config from "./config.json";

export class Server {
  private server: Elysia;
  private servers: Status[] = [];
  private sockets: Servers[] = [];
  private events: object = {};

  constructor(path: string = "/") {
    this.server = new Elysia().ws(path, {
      open: (ws) => {
        this.Check(ws);
        this.servers.push({
          IP: ws.remoteAddress,
          WebSocket: ws,
        });
        this.sockets.push({
          IP: ws.remoteAddress,
          Socket: ws,
        });
        if (this.events["connect"]) this.events["connect"](ws);
      },
      message: (ws, message: string) => {
        if (this.events[message?.event])
          this.events[message?.event](message?.data, ws);
      },
      close: (ws, code, message) => {
        if (this.events["disconnect"]) this.events["disconnect"](ws, code);
        delete this.servers[ws.remoteAddress];
      },
    });
  }
  GetServer(): Elysia {
    return this.server;
  }

  On(event: string, callback: Function) {
    this.events[event] = callback;
  }

  Remove(event: string) {
    if (this.events[event]) delete this.events[event];
  }

  GetClients(): Servers[] {
    return this.servers;
  }

  GetClientByIP(ip: string): WebServer | null {
    const filtered = this.servers.filter((v) => v.IP === ip);
    if (filtered.length > 0) return filtered[0];
    else return null;
  }

  SetClients(clients: Status[]) {
    this.servers = clients;
    fs.writeFileSync(
      "status.json",
      JSON.stringify(
        clients.map((v: Status, index: number): Status => {
          return {
            IP: v.IP,
            ID: index,
            CPULoad: v.CPULoad,
            MEMORYLoad: v.MEMORYLoad,
            Score: v.Score,
          };
        }),
        null,
        4
      )
    );
  }

  Check(ws: ServerWebSocket) {
    if (
      !(
        ws.remoteAddress.startsWith("::") ||
        ws.remoteAddress.startsWith("192.168") ||
        ws.remoteAddress.startsWith("127.0.0")
      )
    )
      ws.close();
  }

  GetSockets(): Servers[] {
    return this.sockets;
  }

  static Emit(
    socket: ServerWebSocket,
    event: string,
    data: string | number | object
  ) {
    socket.send(JSON.stringify({ event, data }));
  }
}
