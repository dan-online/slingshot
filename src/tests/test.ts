import { assertEquals, ky as kyD } from "./test_deps.ts";
import { Slingshot, Response } from "../../mod.ts";

const ky = kyD.default;

const app = new Slingshot();

async function fetchy(path: string, method: string) {
  const func = ky[method];
  if (!func) throw new Error("Method not found!");
  const response = func("http://localhost:8080/" + String(path));
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

Deno.test({
  name: "close server",
  fn: function () {
    app.close();
  },
  sanitizeResources: false,
  sanitizeOps: false,
});
