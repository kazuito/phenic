import { AppType } from "../app/api/[...route]/route";
import { hc } from "hono/client";

const client = hc<AppType>("/");

export default client;
