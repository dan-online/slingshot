import { assertEquals } from "./test_deps.ts";
import { Slingshot, Response } from "../../mod.ts";

const app = new Slingshot();

async function fetchy(path: string, method: string) {
  const res = await fetch("http://localhost:8080/" + path, { method });
  const parsed = await res.json();
  return parsed;
}
function vals() {
  const path = String(Math.random());
  const value = String(Math.random());
  return { path, value };
}

Deno.test("get request (promise)", async () => {
  const { path, value } = vals();
  app.promises.get("/" + path).then((route: any) => {
    const { res } = route;
    return res.status(200).json({ value });
  });
  const parsed = await fetchy(path, "get");
  assertEquals(parsed.value, value);
});

Deno.test("get request (cb)", async () => {
  const { path, value } = vals();
  app.callbacks.get("/" + path, (req: Request, res: Response) => {
    res.status(200).json({ value });
  });
  const parsed = await fetchy(path, "get");
  assertEquals(parsed.value, value);
});

Deno.test("post request (cb)", async () => {
  const { path, value } = vals();
  app.callbacks.post("/" + path, (req: Request, res: Response) => {
    res.status(200).json({ value });
  });
  const parsed = await fetchy(path, "post");
  assertEquals(parsed.value, value);
});

Deno.test("post request (promise)", async () => {
  const { path, value } = vals();
  app.promises.post("/" + path).then(({ res }) => {
    return res.status(200).json({ value });
  });
  const parsed = await fetchy(path, "post");
  assertEquals(parsed.value, value);
});

// Type checks

Deno.test("wrong status code", async () => {
  const { path, value } = vals();
  function test(cb: (err?: Error) => void) {
    app.callbacks.get("/" + path, (req: Request, res: Response) => {
      try {
        res.status(1).json({ value });
        cb(new Error("Status code should have thrown"));
      } catch (err) {
        res.json({ value });
        cb();
      }
    });
  }
  await new Promise(async (res, rej) => {
    let readyToRes = false;
    test((err?: Error) => {
      if (err) return rej(err);
      // console.log(readyToRes);
      if (readyToRes) {
        return res();
      } else {
        readyToRes = true;
      }
    });
    await fetchy(path, "get");
    if (readyToRes) {
      return res();
    } else {
      readyToRes = true;
    }
  });
});

Deno.test({
  name: "close server",
  fn: () => {
    app.close();
  },
  sanitizeResources: false,
  sanitizeOps: false,
});
