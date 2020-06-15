import { Threader } from "./src/threader.ts";

const Manager = new Threader();
Manager.init(4);
