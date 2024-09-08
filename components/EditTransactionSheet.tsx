"use client";

import { z } from "zod";
import { useOpenTransaction } from "@/hooks/transactions/store/useOpenTransaction";
import { useGetTransaction } from "@/hooks/transactions/api/useGetTransaction";
import { useEditTransaction } from "@/hooks/transactions/api/useEditTransaction";
import { useDeleteTransaction } from "@/hooks/transactions/api/useDeleteTransaction";
import { useGetCategories } from "@/hooks/categories/api/useGetCategories";
import { useCreateCategory } from "@/hooks/categories/api/useCreateCategory";
import { useGetAccounts } from "@/hooks/accounts/api/useGetAccounts";
import { useConfirm } from "@/hooks/useConfirm";
import TransactionForm from "@/components/TransactionForm";
import { TransactionsModel } from "@/prisma/zod";
import { Loader2 } from "lucide-react";
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

export default function() {
    const { isOpen, onClose, id } = useOpenTransaction();

    const transactionQuery = useGetTransaction(id);
    const editMutation = useEditTransaction(id);
    const deleteMutation = useDeleteTransaction(id);

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

    const isPending = editMutation.isPending || deleteMutation.isPending || transactionQuery.isLoading || categoryMutation.isPending;
    const isLoading = transactionQuery.isLoading || categoryQuery.isLoading || accountQuery.isLoading;

    const [ConfirmDialog, confirm] = useConfirm(
        "Are you sure?",
        "You are about to delete this transaction."
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

    const defaultValues = transactionQuery.data ? {
        name: transactionQuery.data.name,
        amount: transactionQuery.data.amount.toString(),
        date: new Date(transactionQuery.data.date),
        accountId: transactionQuery.data.accountId,
        categoryId: transactionQuery.data.categoryId,
    } : {
        name: "",
        amount: "",
        date: new Date(),
        accountId: "",
        category: "",
    };

    return <>
        <ConfirmDialog />
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="space-y-4">
                <SheetHeader>
                    <SheetTitle>
                        Edit Transaction
                    </SheetTitle>
                    <SheetDescription>
                        Edit an existing transaction.
                    </SheetDescription>
                </SheetHeader>
                {isLoading 
                    ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Loader2 className="size-4 text-muted-foreground animate-spin"/>
                        </div>
                    ) : (
                        <TransactionForm 
                            id={id}
                            onSubmit={onSubmit}
                            onDelete={onDelete}
                            defaultValues={defaultValues}
                            disabled={isPending}
                            categoryOptions={categoryOptions}
                            onCreateCategory={onCreateCategory}
                            accountOptions={accountOptions}
                        />
                    )
                }
            </SheetContent>
        </Sheet>
    </>
}
