"use client";

import { FaPiggyBank } from "react-icons/fa";
import { FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6";
import { formatDateRange } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { useGetOverview } from "@/hooks/overview/api/useGetOverview";
import { DataCard, DataCardSkeleton } from "@/components/DataCard";

export default function() {
    const { data, isLoading } = useGetOverview();

    const params = useSearchParams();
    const from = params.get("from") || undefined;
    const to = params.get("to") || undefined;

    const dateRangeLabel = formatDateRange({ from, to });
    
    if (isLoading) {
        return <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <DataCardSkeleton />
            <DataCardSkeleton />
            <DataCardSkeleton />
        </div>
    }

    return <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <DataCard 
            title="Remaining"
            value={data?.remainingAmount}
            percentageChange={data?.remainingChange}
            icon={FaPiggyBank}
            variant="default"
            dateRange={dateRangeLabel}
        />
        <DataCard 
            title="Income"
            value={data?.incomeAmount}
            percentageChange={data?.incomeChange}
            icon={FaArrowTrendUp}
            variant="success"
            dateRange={dateRangeLabel}
        />
        <DataCard 
            title="Expenses"
            value={data?.expensesAmount}
            percentageChange={data?.expensesChange}
            icon={FaArrowTrendDown}
            variant="danger"
            dateRange={dateRangeLabel}
        />
    </div>
}
