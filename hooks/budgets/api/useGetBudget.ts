import { client } from "@/lib/hono";
import { convertAmountFromMiliUnits } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

export const useGetBudget = (id?: string) => {
    const query = useQuery({
        enabled: !!id,
        queryKey: ["budget", { id }],
        queryFn: async () => {
            const res = await client.api.budgets[":id"]["$get"]({ 
                param: { id },
            });

            if (!res.ok) {
                throw new Error("Failed to fetch budget");
            }

            const { data } = await res.json();

            return {...data, amount: convertAmountFromMiliUnits(data.amount)};
        }
    });

    return query;
};
