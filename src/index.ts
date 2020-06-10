import { serve, debug, ServerRequest } from "../deps.ts";
import { Response } from "./utils/response.ts";
// for await (const req of s) {
//   req.respond({ body: "Hello World\n" });
// }

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
  log: { info: any };
  paths: Array<{ method: string; path: string; cb: Function }>;
  constructor(config = { port: 8080 }) {
    this.app = serve(config);
    this.log = { info: debug("slingshot:info") };
    this.log.info("server started");
    this.paths = [];
    this.listen();
    return this;
  }
  private async listen() {
    for await (const req of this.app) {
      this.handleRequest(req);
    }
  }
  private handleRequest(req: ServerRequest) {
    const handler = this.paths.find((x) =>
      x.method.toLowerCase() == req.method.toLowerCase() && x.path == req.url
    );
    if (!handler) {
      return req.respond({ status: 404 });
    }
    return handler.cb(req, new Response(req));
  }
  /**
   * 
   * @param path - string of path
   * @param cb - callback of request
   * ```js
   * Slingshot.get("/test", (request, response) => response.send("Hi"));
   * ```
   */
  get(path: string, cb: Function) {
    this.paths.push({
      method: "get",
      path,
      cb,
    });
  }
}

export { Slingshot };
