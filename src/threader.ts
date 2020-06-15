import { serve } from "./deps.ts";
class Threader {
  options: { port: number };
  balancer: any;
  load: any;
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
    this.load.push(options);
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
      const ind = this.load.indexOf(server);
      this.load[ind].reqs.push(req);
      let load = 0;
      this.load.forEach((x: any) => (load += x.reqs.length));
      // console.table(this.load);
      fetch("http://localhost:" + server.port + req.url, {
        method: req.method,
        headers: req.headers,
      }).then((resp) => {
        req.respond({ status: 200 || resp.status, headers: resp.headers });
        req.done.then(() => {
          this.load[ind].reqs = this.load[ind].reqs.filter(
            (x: any) => x.id !== req.id
          );
        });
      });
    }
  }
}

export { Threader };
