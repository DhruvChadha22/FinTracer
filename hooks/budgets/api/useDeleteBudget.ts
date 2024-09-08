import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.budgets[":id"]["$delete"]>;

export const useDeleteBudget = (id?: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error>({
        mutationFn: async () => {
            const res = await client.api.budgets[":id"]["$delete"]({
                param: { id }
            });
            return await res.json();
        },
        onSuccess: () => {
            toast.success("Budget deleted");
            queryClient.invalidateQueries({ queryKey: ["budget", { id }] });
            queryClient.invalidateQueries({ queryKey: ["budgets"] });
            queryClient.invalidateQueries({ queryKey: ["overview"] });
        },
        onError: () => {
            toast.error("Failed to delete budget");
        }
    });

    return mutation;
};
