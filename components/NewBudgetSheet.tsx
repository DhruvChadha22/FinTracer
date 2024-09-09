"use client";

import { z } from "zod";
import { useNewBudget } from "@/hooks/budgets/store/useNewBudget";
import { useCreateBudget } from "@/hooks/budgets/api/useCreateBudget";
import { BudgetForm } from "@/components/BudgetForm";
import { BudgetsModel } from "@/prisma/zod";
import { 
    Sheet, 
    SheetContent, 
    SheetDescription, 
    SheetHeader, 
    SheetTitle 
} from "@/components/ui/sheet";
import { useGetCategories } from "@/hooks/categories/api/useGetCategories";
import { useCreateCategory } from "@/hooks/categories/api/useCreateCategory";
import { Loader2 } from "lucide-react";

const formSchema = BudgetsModel.omit({
    id: true,
    userId: true
});

type FormValues = z.infer<typeof formSchema>;

export const NewBudgetSheet = () => {
    const { isOpen, onClose } = useNewBudget();

    const createMutation = useCreateBudget();

    const categoryQuery = useGetCategories();
    const categoryMutation = useCreateCategory();
    const onCreateCategory = (name: string) => {
        categoryMutation.mutate({ name });
    };
    const categoryOptions = (categoryQuery.data ?? []).map((category) => ({
        label: category.name,
        value: category.id,
    }));

    const isPending = createMutation.isPending || categoryMutation.isPending;
    const isLoading = categoryQuery.isLoading;

    const onSubmit = (values: FormValues) => {
        createMutation.mutate(values, {
            onSuccess: () => {
                onClose();
            }
        });
    }

    return <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
            <SheetHeader>
                <SheetTitle>
                    New Budget
                </SheetTitle>
                <SheetDescription>
                    Create a new budget to track your expenses.
                </SheetDescription>
            </SheetHeader>
            {isLoading
                ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="size-4 text-muted-foreground animate-spin" />
                    </div>
                )
                : (
                    <BudgetForm 
                        onSubmit={onSubmit}
                        disabled={isPending}
                        categoryOptions={categoryOptions}
                        onCreateCategory={onCreateCategory}
                    />
                )
            }    
        </SheetContent>
    </Sheet>
};
