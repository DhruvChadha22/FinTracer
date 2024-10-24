import { Hono, Context } from 'hono'
import { handle } from 'hono/vercel'
import { AuthConfig, initAuthConfig } from "@hono/auth-js";
import authConfig from '@/auth.config'
import users from "./users"
import overview from "./overview"
import transactions from "./transactions"
import accounts from "./accounts"
import budgets from "./budgets"
import categories from "./categories"

function getAuthConfig(c: Context): AuthConfig {
  return {
    secret: c.env.AUTH_SECRET,
    ...authConfig
  };
};

const app = new Hono().basePath("/api");

app.use("*", initAuthConfig(getAuthConfig));

const routes = app
  .route("/users", users)
  .route("/overview", overview)
  .route("/transactions", transactions)
  .route("/accounts", accounts)
  .route("/budgets", budgets)
  .route("/categories", categories)

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;