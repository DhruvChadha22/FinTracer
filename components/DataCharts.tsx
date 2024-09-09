"use client";

import { Chart, ChartLoading } from "@/components/Chart";
import { CategoryPie, CategoryPieLoading } from "@/components/CategoryPie";
import { BudgetProgress, BudgetProgressLoading } from "@/components/BudgetProgress";
import { BalancesCard, BalancesCardLoading } from "@/components/BalancesCard";
import { useGetOverview } from "@/hooks/overview/api/useGetOverview";

export const DataCharts = () => {
    const { data, isLoading } = useGetOverview();

    if (isLoading) {
        return <div className="flex flex-col gap-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
                <div className="col-span-1 lg:col-span-3 xl:col-span-4">
                    <ChartLoading />
                </div>
                <div className="col-span-1 lg:col-span-3 xl:col-span-2">
                    <CategoryPieLoading />
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
                <div className="col-span-1 lg:col-span-3 xl:col-span-4">
                    <BudgetProgressLoading />
                </div>
                <div className="col-span-1 lg:col-span-3 xl:col-span-2">
                    <BalancesCardLoading />
                </div>
            </div>
        </div>
    }

    return <div className="flex flex-col gap-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
            <div className="col-span-1 lg:col-span-3 xl:col-span-4">
                <Chart data={data?.allDays} />
            </div>
            <div className="col-span-1 lg:col-span-3 xl:col-span-2">
                <CategoryPie data={data?.categories} />
            </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
            <div className="col-span-1 lg:col-span-3 xl:col-span-4">
                <BudgetProgress data={data?.budgets} />
            </div>
            <div className="col-span-1 lg:col-span-3 xl:col-span-2">
                <BalancesCard data={data?.banks} />
            </div>
        </div>
    </div>
};
