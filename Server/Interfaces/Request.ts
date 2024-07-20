export interface Request {
  body: unknown;
  query: Record<string, string | undefined>;
  params: never;
  headers: Record<string, string | undefined>;
  cookie: Record<string, Cookie<any>>;
  method: string;
  path: string;
  set: {
    headers: { [index: string]: string };
    cookie: { [index: string]: string };
  };
  setCookie: Function;
}
