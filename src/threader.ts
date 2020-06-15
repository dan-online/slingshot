import { serve, ServerRequest } from "./deps.ts";
import { SlingRequest } from "./utils/request.ts";
import { SlingResponse } from "./utils/response.ts";
import codes from "./utils/codes.ts";
class Threader {
  options: { port: number };
  balancer: any;
  load: any;
  apps: SlingThread[] = [];
  constructor(options: { port: number } = { port: 8080 }) {
    this.options = options;
    this.balancer = serve(options);
    this.load = [];
    return this;
  }
  init(amount: number) {
    for (let i = 0; i < amount; i++) {
      this.thread(i);
    }
    this.loadBalance();
    return new ThreadHandler(this);
  }
  thread(shard: number) {
    const worker = new Worker(new URL("thread.ts", import.meta.url).href, {
      type: "module",
      deno: true,
    });
    const options = {
      port: this.options.port + shard + 1,
      shard: shard,
      reqs: [],
    };
    worker.postMessage({ options });
    this.apps.push(new SlingThread(this, worker, options));
  }
  async loadBalance() {
    for await (const req of this.balancer) {
      req.id = Math.random();
      let server: any;
      this.load.forEach((x: any) => {
        if (!server) return (server = x);
        if (x.reqs.length < server.reqs.length) {
          return (server = x);
        }
      });
      if (!server) return req.respond({ status: 503 });
      const ind = this.load.indexOf(server);
      this.load[ind].reqs.push(req);
      let load = 0;
      this.load.forEach((x: any) => (load += x.reqs.length));
      fetch("http://localhost:" + server.port + req.url, {
        method: req.method,
        headers: req.headers,
      }).then((resp) => {
        resp.text().then((body) => {
          req.respond({
            status: 200 || resp.status,
            headers: resp.headers,
            body: body,
          });
          req.done.then(() => {
            this.load[ind].reqs = this.load[ind].reqs.filter(
              (x: any) => x.id !== req.id
            );
          });
        });
      });
    }
  }
}

class ThreadHandler {
  t: Threader;
  constructor(threader: Threader) {
    this.t = threader;
    return this;
  }
  get(path: string, cb: (req: SlingRequest, res: SlingSimpRes) => void) {
    this.t.apps.forEach((app) => {
      app.get(path, cb);
    });
  }
}
class SlingThread {
  worker: Worker;
  options: { port: number; shard: number; reqs: ServerRequest[] };
  private listeners: {
    id: string;
    cb: (req: SlingRequest, res: SlingSimpRes) => void;
  }[];
  t: Threader;
  constructor(
    threader: Threader,
    worker: Worker,
    options: {
      port: number;
      shard: number;
      reqs: ServerRequest[];
    }
  ) {
    this.t = threader;
    this.worker = worker;
    this.options = options;
    this.listeners = [];
    this.worker.onmessage = (e) => {
      this.message(e.data);
    };
    return this;
  }
  message(options: any) {
    if (options.alive) {
      return this.t.load.push(this.options);
    }
    if (options.id) {
      const event = this.listeners.find((x) => x.id == options.id);
      event?.cb(
        options.route.req,
        new SlingSimpRes(options.route.res, this.worker, options.id)
      );
    }
  }
  get(path: string, cb: (req: SlingRequest, res: SlingSimpRes) => void) {
    const id = "_" + Math.random().toString(36).substr(2, 9);
    this.worker.postMessage({ path, id });
    this.listeners.push({
      id,
      cb,
    });
  }
}

class SlingSimpRes {
  res: SlingResponse;
  worker: Worker;
  body: string = "";
  statusCode: number = 200;
  id: string;
  constructor(res: SlingResponse, worker: Worker, id: string) {
    this.res = res;
    this.worker = worker;
    this.id = id;
    return this;
  }

  code(status: number) {
    if (!codes.find((x) => x.code === status.toString())) {
      throw new Error("Status code " + status + " is not a valid code");
    }
    this.statusCode = status;
    return this;
  }
  send(text: string) {
    this.body = text;
    return this.end();
  }
  end() {
    this.worker.postMessage({
      id: this.id,
      body: this.body,
      code: this.statusCode,
    });
    return this;
  }
}

export { Threader, SlingThread, SlingSimpRes };
