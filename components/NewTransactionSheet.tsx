"use client";

import { z } from "zod";
import { Loader2 } from "lucide-react";
import { TransactionsModel } from "@/prisma/zod";
import { TransactionForm } from "@/components/TransactionForm";
import { useNewTransaction } from "@/hooks/transactions/store/useNewTransaction";
import { useCreateTransaction } from "@/hooks/transactions/api/useCreateTransaction";
import { useGetCategories } from "@/hooks/categories/api/useGetCategories";
import { useCreateCategory } from "@/hooks/categories/api/useCreateCategory";
import { useGetAccounts } from "@/hooks/accounts/api/useGetAccounts";
import { 
    Sheet, 
    SheetContent, 
    SheetDescription, 
    SheetHeader, 
    SheetTitle 
} from "@/components/ui/sheet";


const formSchema = TransactionsModel.omit({
    id: true,
    userId: true
});

type FormValues = z.infer<typeof formSchema>;

export const NewTransactionSheet = () => {
    const { isOpen, onClose } = useNewTransaction();

    const createMutation = useCreateTransaction();

    const categoryQuery = useGetCategories();
    const categoryMutation = useCreateCategory();
    const onCreateCategory = (name: string) => {
        categoryMutation.mutate({ name });
    };
    const categoryOptions = (categoryQuery.data ?? []).map((category) => ({
        label: category.name,
        value: category.id,
    }));

    const accountQuery = useGetAccounts();
    const accountOptions = (accountQuery.data ?? []).map((account) => ({
        label: account.name,
        value: account.id,
    }));

    const isPending = createMutation.isPending || categoryMutation.isPending;
    const isLoading = categoryQuery.isLoading || accountQuery.isLoading;

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
                    New Transaction
                </SheetTitle>
                <SheetDescription>
                    Add a new transaction.
                </SheetDescription>
            </SheetHeader>
            {isLoading
                ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="size-4 text-muted-foreground animate-spin" />
                    </div>
                )
                : (
                    <TransactionForm 
                        onSubmit={onSubmit}
                        disabled={isPending}
                        categoryOptions={categoryOptions}
                        onCreateCategory={onCreateCategory}
                        accountOptions={accountOptions}
                    />
                )
            }
        </SheetContent>
    </Sheet>
};
