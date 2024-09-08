import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.budgets[":id"]["$patch"]>;
type RequestType = InferRequestType<typeof client.api.budgets[":id"]["$patch"]>["json"];

export const useEditBudget = (id?: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json) => {
            const res = await client.api.budgets[":id"]["$patch"]({
                param: { id },
                json
            });
            return await res.json();
        },
        onSuccess: () => {
            toast.success("Budget updated");
            queryClient.invalidateQueries({ queryKey: ["budget", { id }] });
            queryClient.invalidateQueries({ queryKey: ["budgets"] });
            queryClient.invalidateQueries({ queryKey: ["overview"] });
        },
        onError: () => {
            toast.error("Failed to edit budget");
        }
    });

    return mutation;
};
