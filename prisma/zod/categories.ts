import * as z from "zod"
import * as imports from "../null"
import { CompleteTransactions, RelatedTransactionsModel, CompleteBudgets, RelatedBudgetsModel } from "./index"

export const CategoriesModel = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
})

export interface CompleteCategories extends z.infer<typeof CategoriesModel> {
  transactions: CompleteTransactions[]
  budgets: CompleteBudgets[]
}

/**
 * RelatedCategoriesModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedCategoriesModel: z.ZodSchema<CompleteCategories> = z.lazy(() => CategoriesModel.extend({
  transactions: RelatedTransactionsModel.array(),
  budgets: RelatedBudgetsModel.array(),
}))
