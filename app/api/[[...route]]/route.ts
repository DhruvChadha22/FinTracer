import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import overview from "./overview"
import transactions from "./transactions"
import accounts from "./accounts"
import budgets from "./budgets"
import categories from "./categories"

const app = new Hono().basePath('/api');

const routes = app
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