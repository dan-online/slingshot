import { serve, debug, ServerRequest, Server } from "./deps.ts";
import { SlingResponse } from "./utils/response.ts";

import { parsePath } from "./utils/parse.ts";
import { PromiseRequests } from "./handlers/promise.ts";
import { CallbackRequests } from "./handlers/callback.ts";
import { SlingRequest } from "./utils/request.ts";

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
  app: Server;
  log: {
    info: (msg: string) => void;
    route: (msg: string) => void;
    req: (msg: string) => void;
    warn: (msg: string) => void;
  };
  paths: any = { get: {}, post: {} };
  promises: PromiseRequests;
  callbacks: CallbackRequests;
  config: { port: number; shard: boolean | number };
  constructor(config = { port: 8080, shard: false }) {
    this.app = serve(config);
    this.promises = new PromiseRequests(this);
    this.callbacks = new CallbackRequests(this);
    this.config = config;
    this.log = this.initLog();
    this.log.info(
      (config.shard !== false ? "thread" : "server") +
        " started on port " +
        config.port,
    );
    this.listen();
    return this;
  }
  private async listen() {
    for await (const req of this.app) {
      this.handleRequest(req);
    }
  }
  private initLog() {
    return {
      info: debug(
        "slingshot:info" +
          (this.config.shard !== false ? ":" + this.config.shard : ""),
      ),
      route: debug(
        "slingshot:rout" +
          (this.config.shard !== false ? ":" + this.config.shard : ""),
      ),
      req: debug(
        "slingshot:reqs" +
          (this.config.shard !== false ? ":" + this.config.shard : ""),
      ),
      warn: debug(
        "slingshot:warn" +
          (this.config.shard !== false ? ":" + this.config.shard : ""),
      ),
    };
  }
  private handleRequest(req: ServerRequest) {
    const paths = this.paths[req.method.toLowerCase()];
    if (!paths) return;
    const handler = parsePath(paths, req.url);
    if (!handler || !handler.cb) {
      req.done.then(() => {
        this.log.req(
          req.method +
            " " +
            req.url +
            " " +
            404 +
            " " +
            0 +
            "ms",
        );
      });
      return req.respond({ status: 404 });
    }
    const slingRes = new SlingResponse(req);
    const slingReq = new SlingRequest(req);
    slingRes.onfinish((finishRes: SlingResponse) => {
      this.log.req(
        req.method +
          " " +
          req.url +
          " " +
          finishRes.statusCode +
          " " +
          finishRes.speed +
          "ms",
      );
    });
    handler.cb(null, slingReq, slingRes);
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
