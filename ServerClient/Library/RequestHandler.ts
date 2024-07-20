import { Request } from "../Interfaces/Request";
import type { Handler } from "../Interfaces/RequestHandler";

export class RequestHandler {
  private handlers: Handler[] = [];

  constructor(handlers: Handler[]) {
    this.handlers = handlers;
  }

  HandleRequest(data: { request: Request }, callback: Function) {
    const handler = this.handlers.filter((val: Handler) => {
      return val.path === data.request.path && val.method === data.method;
    });
    if (handler.length === 0) {
      callback(404);
    } else {
      data.request.set.headers = {};
      data.request.set.cookie = {};
      callback(handler[0].handler({ ...data.request, method: data.method }));
    }
  }
}
