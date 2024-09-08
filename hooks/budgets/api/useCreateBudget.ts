import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.budgets.$post>;
type RequestType = InferRequestType<typeof client.api.budgets.$post>["json"];

export const useCreateBudget = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json) => {
            const res = await client.api.budgets.$post({ json });
            return await res.json();
        },
        onSuccess: () => {
            toast.success("Budget created");
            queryClient.invalidateQueries({ queryKey: ["budgets"] });
            queryClient.invalidateQueries({ queryKey: ["overview"] });
        },
        onError: () => {
            toast.error("Failed to create budget");
        }
    });

    return mutation;
};
