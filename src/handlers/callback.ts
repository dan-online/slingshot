import { Slingshot } from "../index.ts";
import { Response } from "../utils/response.ts";

class CallbackRequests {
  app: Slingshot;
  constructor(app: Slingshot) {
    this.app = app;
    return this;
  }
  get(path: string, func: Function) {
    if (this.app.paths["get"][path]) {
      this.app.log.warn("possible overwrite of path: " + path);
    }

    this.app.paths["get"][path] = {
      path,
      cb: (err: Error, req: Request, res: Response) => {
        if (err) throw err;
        func(req, res);
      },
    };
  }
  post(path: string, func: Function) {
    if (this.app.paths["post"][path]) {
      this.app.log.warn("possible overwrite of path: " + path);
    }

    this.app.paths["post"][path] = {
      path,
      cb: (err: Error, req: Request, res: Response) => {
        if (err) throw err;
        func(req, res);
      },
    };
  }
}

export { CallbackRequests };
