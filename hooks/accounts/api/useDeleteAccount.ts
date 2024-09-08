import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.accounts.$delete>;

export const useDeleteAccount = () => {
    const params = useSearchParams();
    const itemId = params.get("itemId") || "";

    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error>({
        mutationFn: async () => {
            const res = await client.api.accounts.$delete({
                query: { itemId }
            });
            return await res.json();
        },
        onSuccess: () => {
            toast.success("Bank Account deleted");
            queryClient.invalidateQueries({ queryKey: ["banks"] });
            queryClient.invalidateQueries({ queryKey: ["accounts"] });
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            queryClient.invalidateQueries({ queryKey: ["overview"] });
        },
        onError: () => {
            toast.error("Failed to delete bank account");
        },
    });

    return mutation;
};
