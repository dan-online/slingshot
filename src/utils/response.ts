import { ServerRequest } from "../deps.ts";

class Response {
  req: ServerRequest;
  finished: boolean = false;
  statusCode: number = 200;
  startTimestamp: number;
  endTimestamp: number = 0;
  speed: number = 0;
  private finishCb: Array<(res: Response) => void> = [];
  constructor(request: ServerRequest) {
    this.req = request;
    this.startTimestamp = new Date().getTime();
    return this;
  }
  private clean() {
    this.endTimestamp = new Date().getTime();
    this.speed = this.endTimestamp - this.startTimestamp;
    this.finishCb.forEach((cb: (res: Response) => void) => {
      cb(this);
    });
    return this;
  }
  onfinish(cb: (res: Response) => void) {
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
