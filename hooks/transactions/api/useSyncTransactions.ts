import { toast } from "sonner";
import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useSyncTransactions = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async () => {
            const res = await client.api.transactions["sync"]["$post"]();
            return await res.json();
        },
        onSuccess: () => {
            toast.success("Transactions synced");
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            queryClient.invalidateQueries({ queryKey: ["overview"] });
        },
        onError: () => {
            toast.error("Failed to sync transactions");
        }
    });

    return mutation;
};
