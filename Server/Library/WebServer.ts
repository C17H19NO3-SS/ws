import Elysia from "elysia";

export class WebServer {
  private server: Elysia;
  constructor(port: number, callback: Function) {
    this.server = new Elysia().listen(port, callback);
  }

  public GetWebServer(): Elysia {
    return this.server;
  }
}
