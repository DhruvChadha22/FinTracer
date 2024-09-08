import { client } from "@/lib/hono"
import { useQuery } from "@tanstack/react-query"

export const useGetLinkToken = () => {
    const query = useQuery({
        queryKey: ["linkToken"],
        queryFn: async () => {
            const res = await client.api.accounts["create_link_token"]["$post"]();

            if (!res.ok) {
                throw new Error("Failed to get link token");
            }

            const { link_token } = await res.json();

            return link_token;
        }
    });

    return query;
};
