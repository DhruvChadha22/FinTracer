"use client";

import { z } from "zod";
import { useOpenBudget } from "@/hooks/budgets/store/useOpenBudget";
import { useGetBudget } from "@/hooks/budgets/api/useGetBudget";
import { useEditBudget } from "@/hooks/budgets/api/useEditBudget";
import { useDeleteBudget } from "@/hooks/budgets/api/useDeleteBudget";
import { useConfirm } from "@/hooks/useConfirm";
import BudgetForm from "@/components/BudgetForm";
import { BudgetsModel } from "@/prisma/zod";
import { Loader2 } from "lucide-react";
import { 
    Sheet, 
    SheetContent, 
    SheetDescription, 
    SheetHeader, 
    SheetTitle 
} from "@/components/ui/sheet";
import { useGetCategories } from "@/hooks/categories/api/useGetCategories";
import { useCreateCategory } from "@/hooks/categories/api/useCreateCategory";


const formSchema = BudgetsModel.omit({
    id: true,
    userId: true
});

type FormValues = z.infer<typeof formSchema>;

export default function() {
    const { isOpen, onClose, id } = useOpenBudget();

    const budgetQuery = useGetBudget(id);
    const editMutation = useEditBudget(id);
    const deleteMutation = useDeleteBudget(id);

    const categoryQuery = useGetCategories();
    const categoryMutation = useCreateCategory();
    const onCreateCategory = (name: string) => {
        categoryMutation.mutate({ name });
    };
    const categoryOptions = (categoryQuery.data ?? []).map((category) => ({
        label: category.name,
        value: category.id,
    }));


    const isPending = editMutation.isPending || deleteMutation.isPending || budgetQuery.isLoading || categoryMutation.isPending;
    const isLoading = budgetQuery.isLoading || categoryQuery.isLoading;

    const [ConfirmDialog, confirm] = useConfirm(
        "Are you sure?",
        "You are about to delete this budget."
    );

    const onSubmit = (values: FormValues) => {
        editMutation.mutate(values, {
            onSuccess: () => {
                onClose();
            }
        });
    };

    const onDelete = async () => {
        const ok = await confirm();

        if (ok) {
            deleteMutation.mutate(undefined, {
                onSuccess: () => {
                    onClose();
                }
            });
        }
    };

    const defaultValues = budgetQuery.data ? {
        name: budgetQuery.data?.name,
        amount: budgetQuery.data?.amount.toString(),
        startDate: new Date(budgetQuery.data?.startDate),
        endDate: new Date(budgetQuery.data?.endDate),
        categoryId: budgetQuery.data?.categoryId,
    } : {
        name: "",
        amount: "",
        startDate: new Date(),
        endDate: new Date(),
        category: null
    };

    return <>
        <ConfirmDialog />
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="space-y-4">
                <SheetHeader>
                    <SheetTitle>
                        Edit Budget
                    </SheetTitle>
                    <SheetDescription>
                        Edit an existing budget.
                    </SheetDescription>
                </SheetHeader>
                {isLoading 
                    ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Loader2 className="size-4 text-muted-foreground animate-spin"/>
                        </div>
                    ) : (
                        <BudgetForm 
                            id={id}
                            onSubmit={onSubmit}
                            onDelete={onDelete}
                            defaultValues={defaultValues}
                            disabled={isPending}
                            categoryOptions={categoryOptions}
                            onCreateCategory={onCreateCategory}
                        />
                    )
                }
            </SheetContent>
        </Sheet>
    </>
}
