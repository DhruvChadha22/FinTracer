import * as z from "zod"
import * as imports from "../null"
import { CompleteTransactions, RelatedTransactionsModel, CompleteItems, RelatedItemsModel } from "./index"

export const AccountsModel = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  itemId: z.string(),
  balance: z.number().int(),
  mask: z.string().nullish(),
})

export interface CompleteAccounts extends z.infer<typeof AccountsModel> {
  transactions: CompleteTransactions[]
  item: CompleteItems
}

/**
 * RelatedAccountsModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedAccountsModel: z.ZodSchema<CompleteAccounts> = z.lazy(() => AccountsModel.extend({
  transactions: RelatedTransactionsModel.array(),
  item: RelatedItemsModel,
}))
