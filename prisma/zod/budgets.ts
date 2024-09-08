import * as z from "zod"
import * as imports from "../null"
import { CompleteCategories, RelatedCategoriesModel } from "./index"

export const BudgetsModel = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  amount: z.number().int(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  categoryId: z.string().nullish(),
})

export interface CompleteBudgets extends z.infer<typeof BudgetsModel> {
  category?: CompleteCategories | null
}

/**
 * RelatedBudgetsModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedBudgetsModel: z.ZodSchema<CompleteBudgets> = z.lazy(() => BudgetsModel.extend({
  category: RelatedCategoriesModel.nullish(),
}))
