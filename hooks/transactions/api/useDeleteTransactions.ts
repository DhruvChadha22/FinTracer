import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.transactions["bulk-delete"]["$post"]>;
type RequestType = InferRequestType<typeof client.api.transactions["bulk-delete"]["$post"]>["json"];

export const useDeleteTransactions = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json) => {
            const res = await client.api.transactions["bulk-delete"]["$post"]({ json });
            return await res.json();
        },
        onSuccess: () => {
            toast.success("Transactions deleted");
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            queryClient.invalidateQueries({ queryKey: ["overview"] });
        },
        onError: () => {
            toast.error("Failed to delete transactions");
        }
    });

    return mutation;
};
