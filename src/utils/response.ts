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
    this.finished = true;
    this.finishCb.forEach((cb: (res: SlingResponse) => void) => {
      cb(this);
    });
    return this;
  }
  private checkSent() {
    if (this.finished) throw new Error("Headers have already been sent!");
  }
  onfinish(cb: (res: SlingResponse) => void) {
    this.finishCb.push(cb);
    return this;
  }
  type(ext: string, force?: boolean) {
    const type = types.find((x) => x.type == ext || x.mime == ext);
    if (!type && !force) {
      throw new Error(
        "type " + ext +
          " is not valid run, with the optional parameter of force for manual",
      );
    }
    this.headers.set("Content-Type", type ? type.mime : ext);
    return type;
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
      type.mime,
    );
    this.end();
  }
  code(status: number) {
    this.checkSent();
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
    this.checkSent();
    this.req.respond(
      { body: this.body, status: this.statusCode, headers: this.headers },
    );
    return this.clean();
  }
}

export { SlingResponse };
