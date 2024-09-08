import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.transactions[":id"]["$patch"]>;
type RequestType = InferRequestType<typeof client.api.transactions[":id"]["$patch"]>["json"];

export const useEditTransaction = (id?: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json) => {
            const res = await client.api.transactions[":id"]["$patch"]({
                param: { id },
                json
            });
            return await res.json();
        },
        onSuccess: () => {
            toast.success("Transaction updated");
            queryClient.invalidateQueries({ queryKey: ["transaction", { id }] });
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            queryClient.invalidateQueries({ queryKey: ["overview"] });
        },
        onError: () => {
            toast.error("Failed to edit transaction");
        }
    });

    return mutation;
};
