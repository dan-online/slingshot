import { SlingRequest } from "./request.ts";
import { SlingResponse } from "./response.ts";

class Path {
  cb: (err: Error, req: SlingRequest, res: SlingResponse) => void;
  path: string;
  constructor(
    path: string,
    cb: (err: Error, req: SlingRequest, res: SlingResponse) => void
  ) {
    this.cb = cb;
    this.path = path;
    return this;
  }
}

export { Path };
