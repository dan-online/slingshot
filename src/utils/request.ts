import { ServerRequest } from "../deps.ts";

class SlingRequest {
  private req: ServerRequest;
  constructor(request: ServerRequest) {
    this.req = request;
    return this;
  }
  get method() {
    return this.req.method;
  }
  get path() {
    return this.req.url;
  }
  get protocol() {
    return this.req.proto;
  }
  get headers() {
    return this.req.headers;
  }
  get length() {
    return this.req.contentLength;
  }
  get remote() {
    return this.req.conn.remoteAddr;
  }
  get local() {
    return this.req.conn.localAddr;
  }
  get body() {
    return this.req.body;
  }
  done(cb: () => void) {
    this.req.done.then(cb);
  }
}

export { SlingRequest };
