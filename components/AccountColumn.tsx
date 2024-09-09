import { useOpenTransaction } from "@/hooks/transactions/store/useOpenTransaction";
import { cn } from "@/lib/utils";
import { TriangleAlert } from "lucide-react";

type Props = {
    id: string;
    account: string | null;
};

export const AccountColumn = ({
    id,
    account,
}: Props) => {
    const { onOpen: onOpenTransaction } = useOpenTransaction();

    const onClick = () => {
        onOpenTransaction(id);
    };

    return <div
        onClick={onClick}
        className={cn(
            "flex items-center cursor-pointer hover:underline",
            !account && "text-rose-500"
        )}
    >
        {!account && <TriangleAlert className="size-4 mr-2 shrink-0" />}
        {account || <span className="text-[12px]">Uncategorized</span>}
    </div>
};
