"use client";

import { FileSearch, Loader2, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import AccountCards from "@/components/AccountCards";
import BankFilter from "@/components/BankFilter";
import PlaidLink from "@/components/PlaidLink";
import DeactivateAccount from "@/components/DeactivateAccount";
import { useGetBankNames } from "@/hooks/accounts/api/useGetBankNames";
import { useSyncBalances } from "@/hooks/accounts/api/useSyncBalances";


export default function() {
    const getBanksQuery = useGetBankNames();
    const syncBalances = useSyncBalances();

    const banksData = getBanksQuery.data || [];

    const isDisabled = banksData.length === 0 || syncBalances.isPending;

    if (getBanksQuery.isLoading) {
        return <div className="w-full pr-4">
            <h2 className="w-fit text-2xl lg:text-4xl font-semibold text-gray-900">
                Bank Accounts
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
            Bank Accounts
        </h2>
        <div className="flex items-center justify-end mb-1">
            <Button 
                onClick={() => syncBalances.mutate()} 
                size="sm"
                variant="outline"
                disabled={isDisabled}
                className="bg-white/50 hover:bg-white/60 focus:bg-white/70 font-normal"
            >
                <RefreshCcw className="size-4 mr-2" />
                Re-Sync Balances
            </Button>
        </div>
        <Card className="border-none drop-shadow-sm min-h-[500px]">
            <CardHeader className="flex flex-col md:flex-row md:justify-between">
                <div className="w-full md:w-3/5 flex flex-col md:flex-row md:items-center gap-2 font-semibold">
                    <BankFilter banksData={banksData} isLoadingBanks={getBanksQuery.isLoading} />
                    <PlaidLink />
                </div>
                <DeactivateAccount />
            </CardHeader>
            <CardContent>
                {banksData.length === 0 
                ? (
                    <div className="flex flex-col items-center justify-center h-[350px] w-full">
                        <FileSearch className="size-6 text-muted-foreground" />
                        <p className="text-muted-foreground text-sm">
                            You are not connected to any banks yet.
                        </p>
                    </div>
                )
                : (  
                    <AccountCards />
                )}
            </CardContent>
        </Card>
    </div>
}
