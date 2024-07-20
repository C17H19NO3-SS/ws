import chalk from "chalk";
import { Client } from "./Client";
import sysinfo from "systeminformation";
import { RequestHandler } from "./Library/RequestHandler";
import { Request } from "./Interfaces/Request";
import { index } from "./Router/index";
import config from "./config.json";

const handler = new RequestHandler([index]);
const client = new Client(
  `${config.WebSocketProtocole}://${config.WebSocketHost}:${config.WebSocketPort}${config.WebSocketPath}`,
  [
    {
      event: "request",
      callback: async (data: object, eventName: string) => {
        handler.HandleRequest(data, (result: string | number) => {
          client.Emit(eventName, result);
        });
      },
    },
  ]
);

client.Connect(async (event: Event) => {
  console.log(chalk.green(`Connected on ${client.url}`));

  setInterval(async () => {
    const cpuInfo = await sysinfo.cpu();
    const loads = await sysinfo.currentLoad();
    const ramInfo = await sysinfo.mem();
    client.Emit("status", {
      CPULoad:
        (loads.currentLoad / cpuInfo.cores) * 100 > 100
          ? 100
          : (loads.currentLoad / cpuInfo.cores) * 100,
      MEMORYLoad: (ramInfo.used / ramInfo.total) * 100,
      Score:
        ((loads.currentLoad / cpuInfo.cores) * 100 > 100
          ? 100
          : (loads.currentLoad / cpuInfo.cores) * 100) /
          20 +
        ((ramInfo.used / ramInfo.total) * 100) / 20,
    });
  }, 5 * 1000);
});
