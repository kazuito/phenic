import { Hono } from "hono";
import { contextStorage } from "hono/context-storage";
import { handle } from "hono/vercel";
import { auth } from "@/lib/auth";
import { type Env } from "@/lib/server/hono";
import exercise from "./exercise";
import location from "./location";
import set from "./set";
import workout from "./workout";

// export const runtime = "edge";

const app = new Hono<Env>().basePath("/api");

app.use(contextStorage());

app.use("*", async (c, next) => {
  const session = await auth();

  if (!session || !session?.user || !session.user.id) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  c.set("userId", session.user.id);

  return next();
});

const routes = app
  .route("/set", set)
  .route("/workout", workout)
  .route("/exercise", exercise)
  .route("/location", location);

export type AppType = typeof routes;

export const GET = handle(app);
export const POST = handle(app);
