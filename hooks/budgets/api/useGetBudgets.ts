import { client } from "@/lib/hono";
import { convertAmountFromMiliUnits } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

export const useGetBudgets = () => {
    const query = useQuery({
        queryKey: ["budgets"],
        queryFn: async () => {
            const res = await client.api.budgets.$get();

            if (!res.ok) {
                throw new Error("Failed to fetch budgets");
            }

            const { data } = await res.json();

            return data.map((budget) => ({
                ...budget,
                amount: convertAmountFromMiliUnits(budget.amount),
            }));
        }
    });

    return query;
};
