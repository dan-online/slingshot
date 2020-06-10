import { assertEquals } from "./test_deps.ts";
import { Slingshot, Response } from "./mod.ts";

const app = new Slingshot();

app.get("/", function (req: Request, res: Response) {
  res.status(200).json({ date: new Date() });
});
// Deno.test("example", function (): void {
//   assertEquals("world", "world");
// });
