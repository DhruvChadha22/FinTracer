"use client";

import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { columns } from "./columns";
import { useNewBudget } from "@/hooks/budgets/store/useNewBudget";
import { useGetBudgets } from "@/hooks/budgets/api/useGetBudgets";
import { useDeleteBudgets } from "@/hooks/budgets/api/useDeleteBudgets";


export default function() {
    const { onOpen } = useNewBudget();

    const deleteBudgets = useDeleteBudgets();
    const budgetsQuery = useGetBudgets();
    const budgets = budgetsQuery.data || [];

    const isDisabled = deleteBudgets.isPending || budgetsQuery.isLoading;

    if (budgetsQuery.isLoading) {
        return <div className="w-full pr-4">
            <h2 className="w-fit text-2xl lg:text-4xl font-semibold text-gray-900">
                Your Budgets
            </h2>
            <Card className="border-none drop-shadow-sm mt-8">
                <CardContent>
                    <div className="h-[500px] w-full flex items-center justify-center">
                        <Loader2 className="size-6 text-slate-300 animate-spin" />
                    </div>
                </CardContent>
            </Card>
        </div>
    }

    return <div className="w-full pr-4">
        <h2 className="w-fit text-2xl lg:text-4xl font-semibold text-gray-900">
            Your Budgets
        </h2>
        <Card className="border-none drop-shadow-sm mt-8 min-h-[500px]">
            <CardContent className="font-semibold pt-4 md:pt-0">
                <Button onClick={onOpen} size="sm" className="flex md:hidden w-full">
                    <Plus className="size-4 mr-2" />
                    Add new
                </Button>
                <DataTable 
                    columns={columns} 
                    data={budgets} 
                    filterKey="name"
                    onOpen={onOpen}
                    onDelete={(rows) => {
                        const ids = rows.map((r) => r.original.id);
                        deleteBudgets.mutate({ ids });
                    }}
                    disabled={isDisabled}
                />
            </CardContent>
        </Card>
    </div>
}
