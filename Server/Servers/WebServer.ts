import { WebServer } from "../Library/WebServer";
import { Server } from "../Server";
import chalk from "chalk";
import cookie from "@elysiajs/cookie";
import config from "../config.json";

export default (SocketServer) => {
  const ws: WebServer = new WebServer(config.WebServerPort, (server) => {
    console.log(
      chalk.green(
        `WebServer started on http://${server.hostname}:${server.port}/`
      )
    );
  });

  ws.GetWebServer()
    .use(cookie())
    .get("*", async (request: Request) => {
      var server = SocketServer.GetSockets()
        .map((val: WebServer): WebServer => {
          return { ...SocketServer.GetClientByIP(val.IP), ...val };
        })
        .sort((a: WebServer, b: WebServer) => {
          return a.Score - b.Score;
        });
      if (server.length > 0) {
        var serv: WebServer = server[0];
        const id = parseInt(
          ""
            .padEnd(18, ".")
            .split(".")
            .map(() => (Math.random() * 9).toFixed(0))
            .join("")
        );
        const result = await new Promise(
          (resolve: (val) => {}, reject: (reason: any) => {}) => {
            Server.Emit(serv.Socket, `request-${id}`, {
              request,
              method: "GET",
            });
            SocketServer.On(`request-${id}`, (data: Request) => {
              request.set.headers = data?.set?.headers;
              request.cookie = data?.set?.cookie;
              SocketServer.Remove(`request-${id}`);
              return resolve(data.body);
            });
          }
        );
        return result;
      } else {
        return 404;
      }
    });
};
