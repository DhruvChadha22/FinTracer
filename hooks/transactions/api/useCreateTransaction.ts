import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.transactions.$post>;
type RequestType = InferRequestType<typeof client.api.transactions.$post>["json"];

export const useCreateTransaction = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json) => {
            const res = await client.api.transactions.$post({ json });
            return await res.json();
        },
        onSuccess: () => {
            toast.success("Transaction created");
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            queryClient.invalidateQueries({ queryKey: ["overview"] });
        },
        onError: () => {
            toast.error("Failed to create transaction");
        }
    });

    return mutation;
};
