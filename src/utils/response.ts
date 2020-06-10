import { ServerRequest } from "../../deps.ts";

class Response {
  req: ServerRequest;
  finished: boolean;
  statusCode: number;
  startTimestamp: number;
  endTimestamp: number;
  speed: number;
  private finishCb: Function[];
  constructor(request: ServerRequest) {
    this.req = request;
    this.finished = false;
    this.statusCode = 200;
    this.finishCb = [];
    this.speed = 0;
    this.startTimestamp = new Date().getTime();
    this.endTimestamp = 0;
    return this;
  }
  private clean() {
    this.endTimestamp = new Date().getTime();
    this.speed = this.endTimestamp - this.startTimestamp;
    this.finishCb.forEach((cb: Function) => {
      cb(this);
    });
    return this;
  }
  onfinish(cb: Function) {
    this.finishCb.push(cb);
    return this;
  }
  status(status: number) {
    this.statusCode = status;
    return this;
  }
  json(info: any) {
    this.req.respond({ body: JSON.stringify(info), status: this.statusCode });
    return this.clean();
  }
  end() {
    this.req.respond({ status: this.statusCode });
    return this.clean();
  }
}

export { Response };
