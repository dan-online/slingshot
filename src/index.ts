import { serve, debug, ServerRequest } from "../deps.ts";
import { Response } from "./utils/response.ts";

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
  log: { info: Function; route: Function; req: Function };
  paths: Array<{ method: string; path: string; cb: Function }> = [];
  constructor(config = { port: 8080 }) {
    this.app = serve(config);
    this.log = {
      info: debug("slingshot:inf"),
      route: debug("slingshot:art"),
      req: debug("slingshot:req"),
    };
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
    const handler = this.paths.find(
      (x) =>
        x.method.toLowerCase() == req.method.toLowerCase() && x.path == req.url
    );
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
    handler.cb(req, res);
  }
  /**
   * Get request handler
   * @param path - string of path
   * @param cb - callback of request
   * ```js
   * Slingshot.get("/test", (request, response) => response.send("Hi"));
   * ```
   */
  get(path: string, cb: Function) {
    this.log.route("added " + path + " route");
    this.paths.push({
      method: "get",
      path,
      cb,
    });
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
