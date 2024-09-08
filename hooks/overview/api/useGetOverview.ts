import { client } from "@/lib/hono";
import { convertAmountFromMiliUnits } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

export const useGetOverview = () => {
    const params = useSearchParams();
    const from = params.get("from") || "";
    const to = params.get("to") || "";
    const accountId = params.get("accountId") || "";

    const query = useQuery({
        queryKey: ["overview", { from, to, accountId }],
        queryFn: async () => {
            const res = await client.api.overview.$get({
                query: {
                    from,
                    to,
                    accountId,
                },
            });

            if (!res.ok) {
                throw new Error("Failed to fetch overview");
            }

            const { data } = await res.json();

            return {
                ...data,
                incomeAmount: convertAmountFromMiliUnits(data.incomeAmount),
                expensesAmount: convertAmountFromMiliUnits(data.expensesAmount),
                remainingAmount: convertAmountFromMiliUnits(data.remainingAmount),
                categories: data.categories.map((category) => ({
                    ...category,
                    value: convertAmountFromMiliUnits(category.value),
                })),
                allDays: data.allDays.map((day) => ({
                    ...day,
                    income: convertAmountFromMiliUnits(day.income),
                    expenses: convertAmountFromMiliUnits(day.expenses),
                })),
                budgets: data.budgets.map((budget) => ({
                    ...budget,
                    value: convertAmountFromMiliUnits(budget.value),
                    remaining: convertAmountFromMiliUnits(budget.remaining),
                })),
                banks: data.banks.map((bank) => ({
                    ...bank,
                    balance: convertAmountFromMiliUnits(bank.balance),
                })),
            };
        }
    });

    return query;
};
