import { Slingshot } from "../index.ts";
import { Response } from "../utils/response.ts";

class PromiseRequests {
  app: Slingshot;
  constructor(app: Slingshot) {
    this.app = app;
    return this;
  }
  createPromise() {
    var cb;
    var promise = new Promise((resolve, reject) => {
      cb = (err: Error, req: Request, res: Response) => {
        if (err) return reject(err);
        return resolve({ req, res });
      };
    });
    return { cb, promise };
  }
  get(path: string) {
    const { promise, cb } = this.createPromise();
    if (this.app.paths["get"][path]) {
      this.app.log.warn("possible overwrite of path: " + path);
    }
    this.app.paths["get"][path] = {
      path,
      cb,
    };
    return promise;
  }
  post(path: string) {
    const { promise, cb } = this.createPromise();
    if (this.app.paths["post"][path]) {
      this.app.log.warn("possible overwrite of path: " + path);
    }
    this.app.paths["post"][path] = {
      path,
      cb,
    };
    return promise;
  }
}

export { PromiseRequests };
