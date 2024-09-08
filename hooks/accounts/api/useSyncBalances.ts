import { toast } from "sonner";
import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useSyncBalances = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async () => {
            const res = await client.api.accounts["sync"]["$post"]();
            return await res.json();
        },
        onSuccess: () => {
            toast.success("Balances synced");
            queryClient.invalidateQueries({ queryKey: ["accounts"] });
            queryClient.invalidateQueries({ queryKey: ["overview"] });
        },
        onError: () => {
            toast.error("Failed to sync balances");
        }
    });

    return mutation;
};
