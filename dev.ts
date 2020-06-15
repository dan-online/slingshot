import { Slingshot, SlingResponse, SlingRequest } from "./mod.ts";

const app = new Slingshot();

app.promises.post("/").then(({ res }) => {
  // promises can only be called once
  return res.code(200).json({ date: new Date() });
});

app.callbacks.get("/callback", (req: SlingRequest, res: SlingResponse) => {
  // callback will be called every time
  res.code(200).json({ date: new Date() });
});
