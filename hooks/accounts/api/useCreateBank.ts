import { toast } from "sonner";
import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { InferResponseType, InferRequestType } from "hono";

type ResponseType = InferResponseType<typeof client.api.accounts["exchange_public_token"]["$post"]>;
type RequestType = InferRequestType<typeof client.api.accounts["exchange_public_token"]["$post"]>["json"];

export const useCreateBank = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json) => {
            const res = await client.api.accounts["exchange_public_token"]["$post"]({ json });
            return await res.json();
        },
        onSuccess: () => {
            toast.success("Bank connected");
            queryClient.invalidateQueries({ queryKey: ["banks"] });
            queryClient.invalidateQueries({ queryKey: ["accounts"] });
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            queryClient.invalidateQueries({ queryKey: ["overview"] });
        },
        onError: () => {
            toast.error("Failed to connect bank");
        },
    });

    return mutation;
};
