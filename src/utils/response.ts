import { ServerRequest, resolve } from "../deps.ts";
import types from "./types.ts";
import Codes from "./codes.ts";
class SlingResponse {
  private req: ServerRequest;
  finished: boolean = false;
  statusCode: number = 200;
  headers: Headers = new Headers();
  startTimestamp: number;
  endTimestamp: number = 0;
  body: string = "";
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
  async file(dir: string) {
    const decoder = new TextDecoder("utf-8");
    const location = resolve(Deno.cwd(), dir);
    const info = await Deno.stat(location);
    if (!info.isFile) throw new Error(location + " is not a valid file");
    const data = await Deno.readFile(location);
    const decoded = decoder.decode(data);
    const ext = location.split(".")[location.split(".").length - 1];
    const type = types.find((x) => x.type == ext);
    if (!type) {
      throw new Error("File type was not found!");
    }
    this.body = decoded;
    this.headers.set(
      "Content-Type",
      type.content,
    );
    this.end();
  }
  code(status: number) {
    if (!Codes.find((x) => x.code == status.toString())) {
      throw new Error("Status code " + status + " is not a valid code");
    }
    this.statusCode = status;
    return this;
  }
  json(info: any) {
    this.body = JSON.stringify(info);
    return this.end();
  }
  end() {
    this.req.respond(
      { body: this.body, status: this.statusCode, headers: this.headers },
    );
    return this.clean();
  }
}

export { SlingResponse };
