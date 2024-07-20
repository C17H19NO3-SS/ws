export class Client {
  private url: string;
  private ws: WebSocket;
  private events: { event: string; callback: Function }[] = [];

  constructor(url: string, events: { event: string; data: object }[]) {
    this.url = url;
    this.events = events;
  }

  Connect(callback: Function) {
    this.ws = new WebSocket(this.url);
    this?.ws?.addEventListener("open", callback);
    this?.ws?.addEventListener("message", (event) => {
      const ev: { event: string; data: string | number | object } = JSON.parse(
        event.data
      );
      this.events
        .filter((v) => ev.event.startsWith(v.event))?.[0]
        ?.callback?.(ev.data, ev.event);
    });
  }

  Emit(event: string, data: string | number | object) {
    this.ws.send(JSON.stringify({ event, data }).toString());
  }

  Disconnect() {
    this.ws.close(0);
  }
  GetSocket() {
    return this.ws;
  }
}
