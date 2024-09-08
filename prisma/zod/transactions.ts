import * as z from "zod"
import * as imports from "../null"
import { CompleteAccounts, RelatedAccountsModel, CompleteCategories, RelatedCategoriesModel } from "./index"

export const TransactionsModel = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  amount: z.number().int(),
  date: z.coerce.date(),
  accountId: z.string().nullish(),
  categoryId: z.string().nullish(),
})

export interface CompleteTransactions extends z.infer<typeof TransactionsModel> {
  account?: CompleteAccounts | null
  category?: CompleteCategories | null
}

/**
 * RelatedTransactionsModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedTransactionsModel: z.ZodSchema<CompleteTransactions> = z.lazy(() => TransactionsModel.extend({
  account: RelatedAccountsModel.nullish(),
  category: RelatedCategoriesModel.nullish(),
}))
