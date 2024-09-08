import NewTransactionSheet from "@/components/NewTransactionSheet";
import EditTransactionSheet from "@/components/EditTransactionSheet";
import NewBudgetSheet from "@/components/NewBudgetSheet";
import EditBudgetSheet from "@/components/EditBudgetSheet";
import EditCategorySheet from "@/components/EditCategorySheet";

export const SheetProvider = () => {
    return <>
        <NewTransactionSheet />
        <EditTransactionSheet />

        <EditCategorySheet />

        <NewBudgetSheet />
        <EditBudgetSheet />
    </>
};
