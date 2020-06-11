import { Slingshot } from "../index.ts";
import { Response } from "../utils/response.ts";

class CallbackRequests {
  app: Slingshot;
  constructor(app: Slingshot) {
    this.app = app;
    return this;
  }
}

export { CallbackRequests };
