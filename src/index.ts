import { serve, debug, ServerRequest } from "../deps.ts";
import { Response } from "./utils/response.ts";

import { PromiseRequests } from "./handlers/promise.ts";
import { CallbackRequests } from "./handlers/callback.ts";

const log = {
  info: debug("slingshot:info"),
  route: debug("slingshot:rout"),
  req: debug("slingshot:reqs"),
  warn: debug("slingshot:warn"),
};

/**
 * The Slingshot core
 * @constructor
 * @example
 * ```js
 * const app = new Slingshot({ port: 8080 })
 * ```
 * @param config - Configuration for server
 */
class Slingshot {
  app: any;
  log: { info: Function; route: Function; req: Function; warn: Function } = log;
  paths: any = { get: {} };
  promises: PromiseRequests;
  callbacks: CallbackRequests;
  constructor(config = { port: 8080 }) {
    this.app = serve(config);
    this.promises = new PromiseRequests(this);
    this.callbacks = new CallbackRequests(this);
    this.log.info("server started");
    this.listen();
    return this;
  }
  private async listen() {
    for await (const req of this.app) {
      if (this.app.closing) return;
      this.handleRequest(req);
    }
  }
  private handleRequest(req: ServerRequest) {
    const handler = this.paths[req.method.toLowerCase()][req.url];
    if (!handler) {
      return req.respond({ status: 404 });
    }
    const res = new Response(req);
    res.onfinish((finishRes: Response) => {
      this.log.req(
        req.method +
          " " +
          req.url +
          " " +
          finishRes.statusCode +
          " " +
          finishRes.speed +
          "ms"
      );
    });
    handler.cb(null, req, res);
  }
  /**
   * Close the server
   * ```js
   * Slingshot.close();
   * ```
   */
  close() {
    this.app.close();
    return this;
  }
}

export { Slingshot };
