import { Server } from "../Server";
import config from "../config";
import chalk from "chalk";

export const SocketServer = new Server();

SocketServer.GetServer().listen(config.WebSocketPort, (server) => {
  console.log(
    chalk.green(`WebSocket started on ws://${server.hostname}:${server.port}/`)
  );
});

SocketServer.On("status", (data: Load, ws: ServerWebSocket) => {
  SocketServer.SetClients(
    SocketServer.GetClients().map((val: WebServer) => {
      if (val.IP === ws.remoteAddress) {
        val.CPULoad = data.CPULoad;
        val.MEMORYLoad = data.MEMORYLoad;
        val.Score = data.Score;
      }
      return val;
    })
  );
});

SocketServer.On("disconnect", (ws: ServerWebSocket) => {
  SocketServer.SetClients(
    SocketServer.GetClients().filter((v) => v.IP !== ws.remoteAddress)
  );
});
