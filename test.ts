import { assertEquals } from "./test_deps.ts";
import { Slingshot, Response } from "./mod.ts";
import ky from "https://unpkg.com/ky/index.js";

const app = new Slingshot();

Deno.test("get request (promise)", async () => {
  const path = Math.random(),
    value = Math.random();
  app.promises.get("/" + path).then((route: any) => {
    const { res } = route;
    return res.status(200).json({ value });
  });
  const response = ky.get("http://localhost:8080/" + String(path));
  const parsed = await response.json();
  assertEquals(parsed.value, value);
});

// Deno.test("get request (promise)", async () => {
//   const path = Math.random(),
//     value = Math.random();
//   app.get("/" + path).then(function (route: { res: Response; req: Request }) {
//     route.res.status(200).json({ value });
//   });
//   const response = ky.get("http://localhost:8080/" + String(path));
//   const parsed = await response.json();
//   assertEquals(parsed.value, value);
// });

// Deno.test("get request (await)", async () => {
//   const path = Math.random(),
//     value = Math.random();
//   const { res, req } = await app.get("/" + path);
//   res.status(200).json({ value });
//   const response = ky.get("http://localhost:8080/" + String(path));
//   const parsed = await response.json();
//   assertEquals(parsed.value, value);
// });

Deno.test({
  name: "close server",
  fn: function () {
    app.close();
    console.log();
  },
  sanitizeResources: false,
  sanitizeOps: false,
});
