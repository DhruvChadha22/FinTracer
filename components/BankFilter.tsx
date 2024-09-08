"use client";

import qs from "query-string";
import { 
    useRouter, 
    useSearchParams, 
    usePathname 
} from "next/navigation";
import { 
    Select, 
    SelectContent, 
    SelectGroup, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";

type Props = {
    banksData: {
        id: string;
        bankName: string | null;
    }[];
    isLoadingBanks: boolean;
};

export default function({
    banksData,
    isLoadingBanks
}: Props) {
    const router = useRouter();
    const params = useSearchParams();
    const itemId = params.get("itemId") || "all";
    const pathname = usePathname();

    let currItemId = itemId;
    
    const onChange = (newValue: string) => {
        const query = {
            itemId: newValue,
        };

        currItemId = newValue;

        if (newValue === "all") {
            query.itemId = "";
        }

        const url = qs.stringifyUrl({
            url: pathname,
            query,
        }, { skipNull: true, skipEmptyString: true });

        router.push(url);
    };

    return <Select value={itemId} onValueChange={onChange} disabled={isLoadingBanks}>
        <SelectTrigger>
            <SelectValue placeholder="Select bank" />
        </SelectTrigger>
        <SelectContent>
            <SelectGroup>
                <SelectItem value="all">
                    All bank accounts
                </SelectItem>
                {banksData.map((bank) => (
                    <SelectItem key={bank.id} value={bank.id}>
                        {bank.bankName}
                    </SelectItem>
                ))}
            </SelectGroup>
        </SelectContent>
    </Select>
}
