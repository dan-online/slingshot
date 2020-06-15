import { Slingshot } from "../slingshot.ts";
import { SlingResponse } from "../utils/response.ts";
import { SlingRequest } from "../utils/request.ts";
import { Path } from "../utils/path.ts";

class CallbackRequests {
  app: Slingshot;
  constructor(app: Slingshot) {
    this.app = app;
    return this;
  }
  get(path: string, func: (req: SlingRequest, res: SlingResponse) => void) {
    if (this.app.paths.get[path]) {
      this.app.log.warn("possible overwrite of path: " + path);
    }
    const cb = (err: Error, req: SlingRequest, res: SlingResponse) => {
      if (err) throw err;
      return func(req, res);
    };
    this.app.paths.get[path] = new Path(path, cb);
  }
  post(path: string, func: (req: SlingRequest, res: SlingResponse) => void) {
    if (this.app.paths.post[path]) {
      this.app.log.warn("possible overwrite of path: " + path);
    }

    const cb = (err: Error, req: SlingRequest, res: SlingResponse) => {
      if (err) throw err;
      return func(req, res);
    };
    this.app.paths.post[path] = new Path(path, cb);
  }
}

export { CallbackRequests };
