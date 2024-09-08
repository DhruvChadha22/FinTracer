import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query"

export const useGetBankNames = () => {
    const query = useQuery({
        queryKey: ["banks"],
        queryFn: async () => {
            const res = await client.api.accounts.banks.$get();

            if (!res.ok) {
                throw new Error("Failed to fetch connected banks");
            }

            const { data } = await res.json();

            return data;
        },
    });

    return query;
};
