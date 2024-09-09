import { Unplug } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useConfirm } from "@/hooks/useConfirm";
import { useDeleteAccount } from "@/hooks/accounts/api/useDeleteAccount";

export const DeactivateAccount = () => {
    const router = useRouter();
    const pathname = usePathname();
    const params = useSearchParams();
    const itemId = params.get("itemId");

    const deleteMutation = useDeleteAccount();

    const [ConfirmDialog, confirm] = useConfirm(
        "Are you sure?",
        "You are about to delete this bank along with its connected accounts and transactions."
    );

    const onDelete = async () => {
        const ok = await confirm();

        if (ok) {
            deleteMutation.mutate(undefined, {
                onSuccess: () => {
                    router.push(pathname)
                },
            });
        }
    };

    return <>
        <ConfirmDialog />
        <Button 
            variant="outline" 
            size="sm" 
            onClick={onDelete}
            disabled={deleteMutation.isPending}
            className={cn(
                itemId ? "flex" : "hidden",
            )}
        >
            <Unplug className="size-4 mr-2" />
            Deactivate
        </Button>
    </>
};
