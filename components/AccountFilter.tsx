"use client";

import qs from "query-string";
import {
    useRouter,
    usePathname,
    useSearchParams
} from "next/navigation";
import { useGetAccounts } from "@/hooks/accounts/api/useGetAccounts";
import { useGetOverview } from "@/hooks/overview/api/useGetOverview";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";

export default function() {
    const router = useRouter();
    const pathname = usePathname();

    const params = useSearchParams();
    const accountId = params.get("accountId") || "all";
    const from = params.get("from") || "";
    const to = params.get("to") || "";

    const {
        data: accounts,
        isLoading: isLoadingAccounts
    } = useGetAccounts();
    const {
        isLoading: isLoadingOverview
    } = useGetOverview();

    const onChange = (newValue: string) => {
        const query = {
            accountId: newValue,
            from,
            to,
        };

        if (newValue === "all") {
            query.accountId = "";
        }

        const url = qs.stringifyUrl({
            url: pathname,
            query,
        }, { skipNull: true, skipEmptyString: true });

        router.push(url);
    };

    return <Select
        value={accountId}
        onValueChange={onChange}
        disabled={isLoadingAccounts || isLoadingOverview}
    >
        <SelectTrigger
            className="lg:w-auto w-full h-9 rounded-md px-3 font-normal bg-white/50 hover:bg-white/60 border-none focus:ring-offset-0 focus:ring-transparent outline-none focus:bg-white/70 transition"
        >
            <SelectValue placeholder="Select account" />
        </SelectTrigger>
        <SelectContent>
            <SelectItem value="all">
                All accounts
            </SelectItem>
            {accounts?.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                    {account.name}
                </SelectItem>
            ))}
        </SelectContent>
    </Select>
}
