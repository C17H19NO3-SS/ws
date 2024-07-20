import type { ServerWebSocket } from "bun";

export interface WebServer {
  IP: string;
  Score: number;
}

export interface Status {
  IP: string;
  ID: string | number;
  CPULoad: number;
  MEMORYLoad: number;
  Score: number;
}
