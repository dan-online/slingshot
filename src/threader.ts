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
    for (var i = 0; i < amount; i++) {
      this.thread(i);
    }
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
    worker.postMessage(
      { options },
    );
    this.load.push(options);
  }
}

export { Threader };
