import { Slingshot } from "../index.ts";
import { Response } from "../utils/response.ts";

class PromiseRequests {
  app: Slingshot;
  constructor(app: Slingshot) {
    this.app = app;
    return this;
  }
  get(path: string) {
    var cb;
    const promise = new Promise((resolve, reject) => {
      cb = (err: Error, req: Request, res: Response) => {
        if (err) return reject(err);
        return resolve({ req, res });
      };
    });
    if (this.app.paths["get"][path]) {
      this.app.log.warn("possible overwrite of path: " + path);
    }
    this.app.paths["get"][path] = {
      path,
      cb,
    };
    return promise;
  }
}

export { PromiseRequests };
