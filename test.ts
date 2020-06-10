import { assertEquals } from "./test_deps.ts";
import { Slingshot, Response } from "./mod.ts";
import ky from "https://unpkg.com/ky/index.js";

const app = new Slingshot();

app.get("/", function (req: Request, res: Response) {
  res.status(200).json({ date: new Date() });
});

Deno.test("get request", async () => {
  const path = Math.random(),
    value = Math.random();
  app.get("/" + path, function (req: Request, res: Response) {
    res.status(200).json({ value });
  });
  const response = ky.get("http://localhost:8080/" + String(path));
  const parsed = await response.json();
  assertEquals(parsed.value, value);
});

Deno.test({
  name: "close server",
  fn: function () {
    app.close();
    console.log();
  },
  sanitizeResources: false,
  sanitizeOps: false,
});
