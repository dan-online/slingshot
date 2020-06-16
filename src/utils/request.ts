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
    return this.req.url.split("?")[0];
  }
  get url() {
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
  get query() {
    const splut = this.url.split("?");
    if (splut.length < 2) return {};
    const query: { [key: string]: any } = {};
    splut[1].split("&").forEach((q) => {
      query[q.split("=")[0]] = q.split("=")[1] || true;
    });
    return query;
  }
  done(cb: () => void) {
    this.req.done.then(cb);
  }
}

export { SlingRequest };
