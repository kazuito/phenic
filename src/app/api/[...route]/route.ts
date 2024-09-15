import { Hono } from "hono";
import { handle } from "hono/vercel";
import set from "./set";
import workout from "./workout";
import exercise from "./exercise";
import location from "./location";

// export const runtime = "edge";

const app = new Hono().basePath("/api");
const routes = app
  .route("/set", set)
  .route("/workout", workout)
  .route("/exercise", exercise)
  .route("/location", location);

export type AppType = typeof routes;

export const GET = handle(app);
export const POST = handle(app);
