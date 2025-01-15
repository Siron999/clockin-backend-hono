import { Hono } from "hono";
import v1Routes from "./v1/routes";

const hono = new Hono();

hono.route("/v1", v1Routes);

export default hono;
