import { Handler } from "../Interfaces/RequestHandler";
import { Request } from "../Interfaces/Request";

export const index: Handler = {
  path: "/",
  method: "GET",
  handler: (data: Request) => {
    data.set.headers["x-powered-by"] = "SJS";
    data.set.cookie["test"] = "123";
    return { body: data.method.toUpperCase(), ...data };
  },
};
