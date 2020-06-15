import { Slingshot, SlingResponse, SlingRequest } from "./mod.ts";

const app = new Slingshot();

app.callbacks.get("/", function (req: SlingRequest, res: SlingResponse) {
  console.log(req.path);
  res.end();
});
