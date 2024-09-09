import { cn, formatCurrency } from "@/lib/utils";
import { FileSearch, Loader2, TriangleAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
    data?: {
        name: string;
        balance: number;
    }[];
};

export const BalancesCard = ({ data = [] }: Props) => {
    return <Card className="border-none drop-shadow-sm">
        <CardHeader className="flex space-y-2 lg:space-y-0 lg:flex-row lg:items-center justify-between">
            <CardTitle className="text-xl line-clamp-1">
                Banks
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
                    <div className="-mt-2 h-[272px]">
                        {data.map((bank) => (
                            <div 
                                key={bank.name}
                                className={cn(
                                    "border rounded-lg p-2 mb-1.5 hover:scale-105 transition ease-in-out",
                                    bank.balance > 0 ? "hover:bg-emerald-100" : "hover:bg-rose-100"
                                )}>
                                <div className="flex flex-col">
                                    <span>{bank.name}</span>
                                    <div className="flex flex-row items-center justify-between">
                                        <span className="text-muted-foreground text-sm">Balance</span>
                                        <span className={cn(
                                            "text-sm font-semibold",
                                            bank.balance > 0 ? "text-emerald-600" : "text-rose-600"
                                        )}>
                                            <div className="flex items-center">
                                                {bank.balance < 0 && <TriangleAlert className="size-4 mr-2" />}
                                                {formatCurrency(bank.balance)}
                                            </div>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            }
        </CardContent>
    </Card>
};

export const BalancesCardLoading = () => {
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
