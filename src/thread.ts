import { Slingshot } from "./slingshot.ts";

self.onmessage = (e) => {
  const { options } = e.data;
  new Slingshot(options);
};
