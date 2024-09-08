import { Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePlaidLink } from "react-plaid-link";
import { useCreateBank } from "@/hooks/accounts/api/useCreateBank";
import { useGetLinkToken } from "@/hooks/accounts/api/useGetLinkToken";
import { useSyncTransactions } from "@/hooks/transactions/api/useSyncTransactions";

export default function() {
    const linkQuery = useGetLinkToken();
    const addBankQuery = useCreateBank();
    const syncTransactions = useSyncTransactions();

    const linkToken = linkQuery.data || "";

    const { open, ready } = usePlaidLink({
        token: linkToken,
        onSuccess: (public_token, metadata) => {
            addBankQuery.mutate({ publicToken: public_token }, {
                onSuccess: () => {
                    syncTransactions.mutate();
                },
            });
        },
    });

    return <Button onClick={() => open()} disabled={!ready || addBankQuery.isPending} size="sm">
        <Link className="size-4 mr-2" />
        Connect Account
    </Button>
}
