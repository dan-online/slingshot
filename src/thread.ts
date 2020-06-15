import { Slingshot } from "./slingshot.ts";
import { SlingRequest } from "./utils/request.ts";
import { SlingResponse } from "./utils/response.ts";
let app: Slingshot;
let allRes: { id: string; res: SlingResponse }[] = [];
self.onmessage = (e) => {
  const { options, path, id, body, code } = e.data;
  if (options) {
    app = new Slingshot(options);
    self.postMessage({ alive: true });
  }
  if (path && id) {
    app.callbacks.get(path, (req: SlingRequest, res: SlingResponse) => {
      self.postMessage({ id, route: { req, res } });
      allRes.push({ id, res });
      return;
    });
  }
  if (body != undefined && id && code) {
    let find = allRes.find((x) => x.id == id);
    if (find) {
      find.res.code(code).send(body);
      allRes = allRes.filter((x) => x.id != id);
    }
  }
};
