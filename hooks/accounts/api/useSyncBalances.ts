import { toast } from "sonner";
import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type ResponseType = void;
type RequestType = {
    id: string;
    bankName: string | null;
}[];

export const useSyncBalances = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (banksData) => {
            await Promise.all(banksData.map(async (bank) => (
                await client.api.accounts.sync.$post({ json: { itemId: bank.id } })
            )));
        },
        onSuccess: () => {
            toast.success("Balances synced");
            queryClient.invalidateQueries({ queryKey: ["accounts"] });
            queryClient.invalidateQueries({ queryKey: ["overview"] });
        },
        onError: () => {
            toast.error("Failed to sync balances");
        }
    });

    return mutation;
};
