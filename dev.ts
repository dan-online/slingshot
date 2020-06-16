// import { Slingshot, SlingResponse, SlingRequest } from "./mod.ts";

// const app = new Slingshot();

// app.promises.get("/").then((route) => {
//   const { res } = route;
//   // promises can only be called once
//   return res.json({ hello: "world" });
// });

// app.callbacks.get("/callback", (req: SlingRequest, res: SlingResponse) => {
//   // callback will be called every time
//   return res.json({ hello: "world" });
// });

import { Threader, SlingSimpRes } from "./src/threader.ts";
import { SlingRequest } from "./src/utils/request.ts";

const Manager = new Threader();

const app = Manager.init(4); // Thread count

app.get("/", function (req: SlingRequest, res: SlingSimpRes) {
  res.send("hi"); // SlingSimpRes is a simpler version of SlingResponse
});
