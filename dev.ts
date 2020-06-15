import { Slingshot, SlingResponse, SlingRequest } from "./mod.ts";

const app = new Slingshot();

app.promises.get("/").then((route) => {
  const { res } = route;
  // promises can only be called once
  return res.json({ hello: "world" });
});

app.callbacks.get("/callback", (req: SlingRequest, res: SlingResponse) => {
  // callback will be called every time
  return res.json({ hello: "world" });
});
