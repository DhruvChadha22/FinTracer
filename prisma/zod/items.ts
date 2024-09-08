import * as z from "zod"
import * as imports from "../null"
import { CompleteAccounts, RelatedAccountsModel } from "./index"

export const ItemsModel = z.object({
  id: z.string(),
  userId: z.string(),
  accessToken: z.string(),
  txnCursor: z.string().nullish(),
  bankName: z.string().nullish(),
})

export interface CompleteItems extends z.infer<typeof ItemsModel> {
  accounts: CompleteAccounts[]
}

/**
 * RelatedItemsModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedItemsModel: z.ZodSchema<CompleteItems> = z.lazy(() => ItemsModel.extend({
  accounts: RelatedAccountsModel.array(),
}))
