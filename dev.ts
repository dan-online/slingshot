import { Slingshot, SlingResponse, SlingRequest } from "./mod.ts";

const app = new Slingshot();

app.callbacks.get("/", function (req: SlingRequest, res: SlingResponse) {
  console.log(req.path);
  res.end();
});

app.callbacks.get("/ih", (req: SlingRequest, res: SlingResponse) => {
  try {
    res.json({ hello: "world" });
    res.json({});
    console.error(new Error("Headers sent should have thrown"));
  } catch (err) {
    console.log("yay");
  }
});
