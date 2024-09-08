import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.budgets["bulk-delete"]["$post"]>;
type RequestType = InferRequestType<typeof client.api.budgets["bulk-delete"]["$post"]>["json"];

export const useDeleteBudgets = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json) => {
            const res = await client.api.budgets["bulk-delete"]["$post"]({ json });
            return await res.json();
        },
        onSuccess: () => {
            toast.success("Budgets deleted");
            queryClient.invalidateQueries({ queryKey: ["budgets"] });
            queryClient.invalidateQueries({ queryKey: ["overview"] });
        },
        onError: () => {
            toast.error("Failed to delete budgets");
        }
    });

    return mutation;
};
