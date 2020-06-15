import { assertEquals } from "./test_deps.ts";
import { Slingshot, SlingResponse, SlingRequest } from "../../mod.ts";

const app = new Slingshot();

async function fetchy(path: string, method: string, json: boolean = true) {
  const res = await fetch("http://localhost:8080/" + path, { method });
  const parsed = json ? await res.json() : await res.text();
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
    return res.code(200).json({ value });
  });
  const parsed = await fetchy(path, "get");
  assertEquals(parsed.value, value);
});

Deno.test("get request (cb)", async () => {
  const { path, value } = vals();
  app.callbacks.get("/" + path, (req: SlingRequest, res: SlingResponse) => {
    res.code(200).json({ value });
  });
  const parsed = await fetchy(path, "get");
  assertEquals(parsed.value, value);
});

Deno.test("post request (cb)", async () => {
  const { path, value } = vals();
  app.callbacks.post("/" + path, (req: SlingRequest, res: SlingResponse) => {
    res.code(200).json({ value });
  });
  const parsed = await fetchy(path, "post");
  assertEquals(parsed.value, value);
});

Deno.test("post request (promise)", async () => {
  const { path, value } = vals();
  app.promises.post("/" + path).then(({ res }) => {
    return res.code(200).json({ value });
  });
  const parsed = await fetchy(path, "post");
  assertEquals(parsed.value, value);
});

Deno.test("get html file", async () => {
  const { path } = vals();
  app.callbacks.get("/" + path, (req: SlingRequest, res: SlingResponse) => {
    return res.file("./src/tests/index.html");
  });
  const parsed = await fetchy(path, "get", false);
  const decoder = new TextDecoder("utf-8");
  const data = Deno.readFileSync("./src/tests/index.html");
  const file = decoder.decode(data);
  assertEquals(parsed, file);
});

// Type checks

async function testingErrors(
  test: (cb: (err?: Error) => void) => void,
  path: string
) {
  await new Promise(async (res, rej) => {
    let readyToRes = false;
    test((err?: Error) => {
      if (err) return rej(err);
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
}

Deno.test("double end", async () => {
  const { path } = vals();
  function test(cb: (err?: Error) => void) {
    app.callbacks.get("/" + path, (req: SlingRequest, res: SlingResponse) => {
      try {
        res.json({ hello: "world" });
        res.json({});
        cb(new Error("Headers sent should have thrown"));
      } catch (err) {
        cb();
      }
    });
  }
  await testingErrors(test, path);
});

Deno.test("wrong status code", async () => {
  const { path } = vals();
  function test(cb: (err?: Error) => void) {
    app.callbacks.get("/" + path, (req: SlingRequest, res: SlingResponse) => {
      try {
        res.code(1).json({ hello: "world" });
        cb(new Error("Status code should have thrown"));
      } catch (err) {
        res.json({ hello: "world" });
        cb();
      }
    });
  }
  await testingErrors(test, path);
});

Deno.test("post (100ms delay)", async () => {
  const { path, value } = vals();
  app.promises.post("/" + path).then(({ res }) => {
    setTimeout(() => res.json({ value }), 100);
  });
  const start = new Date().getTime();
  const parsed = await fetchy(path, "post");
  const speed = Math.round((new Date().getTime() - start) / 100) * 100;
  if (speed === 100) {
    assertEquals(parsed.value, value);
  } else {
    throw new Error("Headers were sent too early!");
  }
});

Deno.test({
  name: "close server",
  fn: () => {
    app.close();
  },
  sanitizeResources: false,
  sanitizeOps: false,
});
