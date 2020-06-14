import { assertEquals } from "./test_deps.ts";
import { Slingshot, Response } from "../../mod.ts";

const app = new Slingshot();
async function fetchy(path: string, method: string) {
  const res = await fetch("http://localhost:8080/" + path, { method });
  const parsed = await res.json();
  return parsed;
}

Deno.test("get request (promise)", async () => {
  const path = String(Math.random());
  const value = String(Math.random());
  app.promises.get("/" + path).then((route: any) => {
    const { res } = route;
    return res.status(200).json({ value });
  });
  const parsed = await fetchy(path, "get");
  assertEquals(parsed.value, value);
});

Deno.test("get request (cb)", async () => {
  const path = String(Math.random());
  const value = Math.random();
  app.callbacks.get("/" + path, (req: Request, res: Response) => {
    res.status(200).json({ value });
  });
  const parsed = await fetchy(path, "get");
  assertEquals(parsed.value, value);
});

Deno.test("post request (cb)", async () => {
  const path = String(Math.random());
  const value = Math.random();
  app.callbacks.post("/" + path, (req: Request, res: Response) => {
    res.status(200).json({ value });
  });
  const parsed = await fetchy(path, "post");
  assertEquals(parsed.value, value);
});

Deno.test("post request (promise)", async () => {
  const path = String(Math.random());
  const value = String(Math.random());
  app.promises.post("/" + path).then(({ res }) => {
    return res.status(200).json({ value });
  });
  const parsed = await fetchy(path, "post");
  assertEquals(parsed.value, value);
});

Deno.test({
  name: "close server",
  fn: () => {
    app.close();
  },
  sanitizeResources: false,
  sanitizeOps: false,
});
