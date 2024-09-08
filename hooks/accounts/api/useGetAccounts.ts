import { client } from "@/lib/hono";
import { convertAmountFromMiliUnits } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

export const useGetAccounts = () => {
    const params = useSearchParams();
    const itemId = params.get("itemId") || "";

    const query = useQuery({
        queryKey: ["accounts", { itemId }],
        queryFn: async () => {
            const res = await client.api.accounts.$get({
                query: { itemId },
            });

            if (!res.ok) {
                throw new Error("Failed to fetch accounts");
            }

            const { data } = await res.json();

            return data.map((account) => ({
                ...account,
                balance: convertAmountFromMiliUnits(account.balance),
            }));
        },
    });

    return query;
};
