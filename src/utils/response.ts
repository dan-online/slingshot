import { ServerRequest } from "../../deps.ts";

class Response {
  req: ServerRequest;
  finished: boolean;
  statusCode: number;
  constructor(request: ServerRequest) {
    this.req = request;
    this.finished = false;
    this.statusCode = 200;
    return this;
  }
  status(status: number) {
    this.statusCode = status;
    return this;
  }
  json(info: any) {
    this.req.respond({ body: JSON.stringify(info), status: this.statusCode });
  }
  end() {
    this.req.respond({ status: this.statusCode });
    return this;
  }
}

export { Response };
