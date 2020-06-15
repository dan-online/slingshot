import { ServerRequest } from "../deps.ts";
import Codes from "./codes.ts";
class SlingResponse {
  private req: ServerRequest;
  finished: boolean = false;
  statusCode: number = 200;
  startTimestamp: number;
  endTimestamp: number = 0;
  speed: number = 0;
  private finishCb: ((res: SlingResponse) => void)[] = [];
  constructor(request: ServerRequest) {
    this.req = request;
    this.startTimestamp = new Date().getTime();
    return this;
  }
  private clean() {
    this.endTimestamp = new Date().getTime();
    this.speed = this.endTimestamp - this.startTimestamp;
    this.finishCb.forEach((cb: (res: SlingResponse) => void) => {
      cb(this);
    });
    return this;
  }
  onfinish(cb: (res: SlingResponse) => void) {
    this.finishCb.push(cb);
    return this;
  }
  code(status: number) {
    if (!Codes.find((x) => x.code == status.toString())) {
      throw new Error("Status code " + status + " is not a valid code");
    }
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

export { SlingResponse };
