import { format } from "date-fns";
import { calculatePercentageChange, cn, formatCurrency, formatPercentage } from "@/lib/utils";
import { FileSearch, Loader2, TriangleAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
    data?: {
        name: string;
        value: number;
        remaining: number;
        startDate: string;
        endDate: string;
    }[];
};

export const BudgetProgress = ({ data = [] }: Props) => {
    return <Card className="border-none drop-shadow-sm">
        <CardHeader className="flex space-y-2 lg:space-y-0 lg:flex-row lg:items-center justify-between">
            <CardTitle className="text-xl line-clamp-1">
                Budgets
            </CardTitle>
        </CardHeader>
        <CardContent>
            {data.length === 0
                ? (
                    <div className="flex flex-col gap-y-4 items-center justify-center h-[265px] w-full">
                        <FileSearch className="size-6 text-muted-foreground" />
                        <p className="text-muted-foreground text-sm">
                            No data for this period.
                        </p>
                    </div>
                )
                : (
                    <div className="h-[265px]">
                        {data.map((budget) => {
                            const percentChange = calculatePercentageChange(budget.remaining, budget.value) * -1;
                            const value = percentChange < 100 ? percentChange : 100;

                            return <div className="flex flex-col gap-1 mb-4">
                                <div className="flex flex-row items-center justify-between">
                                    <span>{budget.name}</span>
                                    <span
                                        className={cn(
                                            "text-sm font-semibold",
                                            budget.remaining > 0 ? "text-emerald-600" : "text-rose-600"
                                        )}
                                    >
                                        <div className="flex items-center">
                                            {budget.remaining < 0 && <TriangleAlert className="size-4 mr-2" />}
                                            {formatCurrency(budget.remaining)}
                                        </div>
                                    </span>
                                </div>
                                <div className="h-5 w-full rounded-full bg-slate-100">
                                    <div 
                                        style={{width: `${value}%`}}
                                        className={cn(
                                            "h-full rounded-full text-white text-center text-sm",
                                            value < 20 && "bg-emerald-500 animate-progress",
                                            value >= 20 && value < 40 && "bg-green-500 animate-green",
                                            value >= 40 && value < 60 && "bg-lime-500 animate-lime",
                                            value >= 60 && value < 80 && "bg-yellow-500 animate-yellow",
                                            value >= 80 && value < 90 && "bg-orange-500 animate-orange",
                                            value >=90 && "bg-rose-500 animate-red"
                                        )}
                                    >
                                        <span>{formatPercentage(value)}</span>
                                    </div>
                                </div>
                                <div className="flex flex-row items-center justify-between">
                                    <span className="text-sm text-muted-foreground">{format(budget.startDate, "MM/dd/yyyy")}</span>
                                    <span className="text-sm text-muted-foreground">{format(budget.endDate, "MM/dd/yyyy")}</span>
                                </div>
                            </div>
                        })}
                    </div>
                )
            }
        </CardContent>
    </Card>
};

export const BudgetProgressLoading = () => {
    return <Card className="border-none drop-shadow-sm">
        <CardHeader className="flex space-y-2 lg:space-y-0 lg:flex-row lg:items-center justify-between">
            <Skeleton className="h-8 w-48" />
        </CardHeader>
        <CardContent>
            <div className="h-[272px] w-full flex items-center justify-center">
                <Loader2 className="h-6 w-6 text-slate-300 animate-spin" />
            </div>
        </CardContent>
    </Card>
};
