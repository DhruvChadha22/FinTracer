import { Button } from "@/components/ui/button";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { useOpenBudget } from "@/hooks/budgets/store/useOpenBudget";
import { useDeleteBudget } from "@/hooks/budgets/api/useDeleteBudget";
import { useConfirm } from "@/hooks/useConfirm";
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";


type Props = {
    id: string;
};

export const Actions = ({ id }: Props) => {
    const { onOpen } = useOpenBudget();
    
    const deleteMutation = useDeleteBudget(id);
    const [ConfirmDialog, confirm] = useConfirm(
        "Are you sure?",
        "You are about to delete this budget."
    );

    const handleDelete = async () => {
        const ok = await confirm();

        if (ok) {
            deleteMutation.mutate();
        }
    };

    return <>
        <ConfirmDialog />
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="size-8 p-0">
                    <MoreHorizontal className="size-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem 
                    disabled={deleteMutation.isPending}
                    onClick={() => onOpen(id)}
                >
                    <Edit className="size-4 mr-2" />
                    Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                    disabled={deleteMutation.isPending}
                    onClick={handleDelete}
                >
                    <Trash className="size-4 mr-2" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    </>
};
