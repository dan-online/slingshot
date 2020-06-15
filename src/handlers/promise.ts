import { Slingshot } from "../index.ts";
import { SlingResponse } from "../utils/response.ts";
import { SlingRequest } from "../utils/request.ts";
import { Path } from "../utils/path.ts";

class PromiseRequests {
  app: Slingshot;
  constructor(app: Slingshot) {
    this.app = app;
    return this;
  }
  createPromise() {
    let cb: any;
    const promise = new Promise(
      (
        resolve: (route: { res: SlingResponse; req: SlingRequest }) => void,
        reject: (err: Error) => void
      ) => {
        cb = (err: Error, req: SlingRequest, res: SlingResponse) => {
          if (err) return reject(err);
          return resolve({ req, res });
        };
      }
    );
    return { cb, promise };
  }
  get(path: string) {
    const { promise, cb } = this.createPromise();
    if (this.app.paths.get[path]) {
      this.app.log.warn("possible overwrite of path: " + path);
    }
    this.app.paths.get[path] = new Path(path, cb);
    return promise;
  }
  post(path: string) {
    const { promise, cb } = this.createPromise();
    if (this.app.paths.post[path]) {
      this.app.log.warn("possible overwrite of path: " + path);
    }
    this.app.paths.post[path] = new Path(path, cb);
    return promise;
  }
}

export { PromiseRequests };
