"use client";

import { useState } from "react";
import { Loader2, Plus, RefreshCcw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { UploadButton } from "@/components/UploadButton";
import { ImportCard } from "@/components/ImportCard";
import { Filters } from "@/components/Filters";
import { columns } from "./columns";
import { useNewTransaction } from "@/hooks/transactions/store/useNewTransaction";
import { useGetTransactions } from "@/hooks/transactions/api/useGetTransactions";
import { useDeleteTransactions } from "@/hooks/transactions/api/useDeleteTransactions";
import { useSelectAccount } from "@/hooks/useSelectAccount";
import { useCreateTransactions } from "@/hooks/transactions/api/useCreateTransactions";
import { useSyncTransactions } from "@/hooks/transactions/api/useSyncTransactions";


enum VARIANTS {
    LIST = "LIST",
    IMPORT = "IMPORT",
};

const INITIAL_IMPORT_RESULTS = {
    data: [],
    errors: [],
    meta: {},
};

type Transactions = {
    name: string;
    amount: number;
    date: Date;
};

export default function TransactionsPage() {
    const [AccountDialog, confirm] = useSelectAccount();
    const [variant, setVariant] = useState<VARIANTS>(VARIANTS.LIST);
    const [importResults, setImportResults] = useState(INITIAL_IMPORT_RESULTS);

    const onUpload = (results: typeof INITIAL_IMPORT_RESULTS) => {
        setImportResults(results);
        setVariant(VARIANTS.IMPORT);
    };

    const onCancelImport = () => {
        setImportResults(INITIAL_IMPORT_RESULTS);
        setVariant(VARIANTS.LIST);
    };
    
    const { onOpen } = useNewTransaction();
    
    const deleteTransactions = useDeleteTransactions();
    const transactionsQuery = useGetTransactions();
    const createTransactions = useCreateTransactions();
    const syncTransactions = useSyncTransactions();

    const transactions = transactionsQuery.data || [];
    
    const isDisabled = deleteTransactions.isPending || transactionsQuery.isLoading || syncTransactions.isPending;
    
    const onSubmitImport = async (values: Transactions[]) => {
        const accountId = await confirm();

        if (accountId !== null) {
            const data = values.map((value) => ({
                ...value,
                accountId: accountId as string,
                categoryId: null,
            }));

            createTransactions.mutate(data, {
                onSuccess: () => {
                    onCancelImport();
                },
            });
        }
    };

    if (transactionsQuery.isLoading) {
        return <div className="w-full pr-4">
            <h2 className="w-fit text-2xl lg:text-4xl font-semibold text-gray-900 mb-4">
                Transaction History
            </h2>
            <Filters />
            <Card className="border-none drop-shadow-sm">
                <CardContent>
                    <div className="h-[500px] w-full flex items-center justify-center">
                        <Loader2 className="size-6 text-slate-300 animate-spin" />
                    </div>
                </CardContent>
            </Card>
        </div>
    }

    if (variant === VARIANTS.IMPORT) {
        return <>
            <AccountDialog />
            <ImportCard 
                data={importResults.data}
                onCancel={onCancelImport}
                onSubmit={onSubmitImport}
            />
        </>
    }

    return <div className="w-full pr-4">
        <h2 className="w-fit text-2xl lg:text-4xl font-semibold text-gray-900 mb-4">
            Transaction History
        </h2>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-2 lg:mb-0">
            <Filters />
            <Button 
                onClick={() => syncTransactions.mutate()} 
                size="sm"
                variant="outline"
                disabled={syncTransactions.isPending}
                className="bg-white/50 hover:bg-white/60 focus:bg-white/70 font-normal"
            >
                <RefreshCcw className="size-4 mr-2" />
                Re-Sync Transactions
            </Button>
        </div>
        <Card className="border-none drop-shadow-sm min-h-[500px]">
            <CardContent className="font-semibold pt-4 md:pt-0">
                <div className="flex flex-col gap-y-2 md:hidden w-full">
                    <Button onClick={onOpen} size="sm">
                        <Plus className="size-4 mr-2" />
                        Add new
                    </Button>
                    <UploadButton onUpload={onUpload} />
                </div>
                <DataTable 
                    columns={columns} 
                    data={transactions} 
                    filterKey="name"
                    onOpen={onOpen}
                    onDelete={(rows) => {
                        const ids = rows.map((r) => r.original.id);
                        deleteTransactions.mutate({ ids });
                    }}
                    onUpload={onUpload}
                    disabled={isDisabled}
                />
            </CardContent>
        </Card>
    </div>
};
