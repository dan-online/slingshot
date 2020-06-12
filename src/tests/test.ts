import { assertEquals } from "./test_deps.ts";
import { Slingshot, Response } from "../../mod.ts";
import ky from "https://unpkg.com/ky/index.js";

const app = new Slingshot();

async function fetchy(path: String, method: String) {
  const response = ky[method]("http://localhost:8080/" + String(path));
  const parsed = await response.json();
  return parsed;
}

Deno.test("get request (promise)", async () => {
  const path = String(Math.random()),
    value = String(Math.random());
  app.promises.get("/" + path).then((route: any) => {
    const { res } = route;
    return res.status(200).json({ value });
  });
  const parsed = await fetchy(path, "get");
  assertEquals(parsed.value, value);
});

Deno.test("get request (cb)", async () => {
  const path = String(Math.random()),
    value = Math.random();
  app.callbacks.get("/" + path, function (req: Request, res: Response) {
    res.status(200).json({ value });
  });
  const parsed = await fetchy(path, "get");
  assertEquals(parsed.value, value);
});

Deno.test("post request (cb)", async () => {
  const path = String(Math.random()),
    value = Math.random();
  app.callbacks.post("/" + path, function (req: Request, res: Response) {
    res.status(200).json({ value });
  });
  const parsed = await fetchy(path, "post");
  assertEquals(parsed.value, value);
});

Deno.test("post request (promise)", async () => {
  const path = String(Math.random()),
    value = String(Math.random());
  app.promises.post("/" + path).then((route: any) => {
    const { res } = route;
    return res.status(200).json({ value });
  });
  const parsed = await fetchy(path, "post");
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

Deno.test({
  name: "close server",
  fn: function () {
    app.close();
    console.log();
  },
  sanitizeResources: false,
  sanitizeOps: false,
});
