import { TriangleAlert } from "lucide-react";
import { useOpenBudget } from "@/hooks/budgets/store/useOpenBudget";
import { useOpenCategory } from "@/hooks/categories/store/useOpenCategory";
import { useOpenTransaction } from "@/hooks/transactions/store/useOpenTransaction";
import { categoryStyles } from "@/lib/category-styles";

type Props = {
    id: string;
    category: string | null;
    categoryId: string | null;
    isTransaction: boolean;
};

export const CategoryColumn = ({
    id,
    category,
    categoryId,
    isTransaction,
}: Props) => {
    const { onOpen: onOpenCategory } = useOpenCategory();
    const { onOpen: onOpenTransaction } = useOpenTransaction();
    const { onOpen: onOpenBudget } = useOpenBudget();

    const {
        borderColor,
        backgroundColor,
        textColor,
    } = categoryStyles[category as keyof typeof categoryStyles] || categoryStyles.default;

    const onClick = () => {
        if (categoryId) {
            onOpenCategory(categoryId);
        } else {
            if (isTransaction) {
                onOpenTransaction(id);
            }
            else {
                onOpenBudget(id);
            }
        }
    };

    return <div
        onClick={onClick}
        className="cursor-pointer hover:underline"
    >
        {category 
        ? (
            <div style={{borderColor: borderColor}} className="flex items-center justify-center truncate w-fit gap-1 rounded-2xl border-[1.5px] py-[2px] pl-1.5 pr-2">
                <div style={{backgroundColor: backgroundColor}} className="size-2 rounded-full" />
                <p style={{color: textColor}} className="text-[12px] font-medium">{category}</p>
            </div>
        ) : 
        (
            <div className="flex items-center text-[12px] text-rose-500">
                <TriangleAlert className="size-4 mr-2 shrink-0" />
                Uncategorized
            </div>
        )}
    </div>
};
