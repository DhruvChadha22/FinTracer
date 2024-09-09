"use client";

import { z } from "zod";
import { useOpenCategory } from "@/hooks/categories/store/useOpenCategory";
import { useGetCategory } from "@/hooks/categories/api/useGetCategory";
import { useEditCategory } from "@/hooks/categories/api/useEditCategory";
import { useDeleteCategory } from "@/hooks/categories/api/useDeleteCategory";
import { useConfirm } from "@/hooks/useConfirm";
import { CategoryForm } from "@/components/CategoryForm";
import { CategoriesModel } from "@/prisma/zod";
import { Loader2 } from "lucide-react";
import { 
    Sheet, 
    SheetContent, 
    SheetDescription, 
    SheetHeader, 
    SheetTitle 
} from "@/components/ui/sheet";


const formSchema = CategoriesModel.omit({
    id: true,
    userId: true
});

type FormValues = z.infer<typeof formSchema>;

export const EditCategorySheet = () => {
    const { isOpen, onClose, id } = useOpenCategory();

    const categoryQuery = useGetCategory(id);
    const editMutation = useEditCategory(id);
    const deleteMutation = useDeleteCategory(id);

    const isPending = editMutation.isPending || deleteMutation.isPending;
    const isLoading = categoryQuery.isLoading;

    const [ConfirmDialog, confirm] = useConfirm(
        "Are you sure?",
        "You are about to delete this category."
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

    const defaultValues = categoryQuery.data ? {
        name: categoryQuery.data?.name,
    } : {
        name: "",
    };

    return <>
        <ConfirmDialog />
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="space-y-4">
                <SheetHeader>
                    <SheetTitle>
                        Edit Category
                    </SheetTitle>
                    <SheetDescription>
                        Edit an existing category.
                    </SheetDescription>
                </SheetHeader>
                {isLoading 
                    ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Loader2 className="size-4 text-muted-foreground animate-spin"/>
                        </div>
                    ) : (
                        <CategoryForm 
                            id={id}
                            onSubmit={onSubmit} 
                            disabled={isPending} 
                            defaultValues={defaultValues}
                            onDelete={onDelete}
                        />
                    )
                }
            </SheetContent>
        </Sheet>
    </>
};
