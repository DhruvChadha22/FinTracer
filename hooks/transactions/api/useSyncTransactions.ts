import { toast } from "sonner";
import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type ResponseType = void;
type RequestType = {
    id: string;
    bankName: string | null;
}[];

export const useSyncTransactions = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (banksData) => {
            await Promise.all(banksData.map(async (bank) => (
                await client.api.transactions.sync.$post({ json: { itemId: bank.id } })
            )));
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
