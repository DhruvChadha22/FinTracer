"use client";

import { useRef, useState } from "react";
import { useGetAccounts } from "@/hooks/accounts/api/useGetAccounts";
import { CustomSelect } from "@/components/CustomSelect";
import { Button } from "@/components/ui/button";
import { 
    Dialog, 
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription, 
    DialogFooter, 
} from "@/components/ui/dialog";

export const useSelectAccount = (): [() => JSX.Element, () => Promise<unknown>] => {
    const accountsQuery = useGetAccounts();
    const accountOptions = (accountsQuery.data ?? []).map((account) => ({
        label: account.name,
        value: account.id,
    }));

    const [promise , setPromise] = useState<{ resolve: (value: string | null | undefined) => void } | null>(null);
    const selectValue = useRef<string>();

    const confirm = () => new Promise((resolve, reject) => {
        setPromise({ resolve });
    });

    const handleClose = () => {
        setPromise(null);
    }

    const handleConfirm = () => {
        promise?.resolve(selectValue.current);
        handleClose();
    }

    const handleCancel = () => {
        promise?.resolve(null);
        handleClose();
    }

    const AccountDialog = () => (
        <Dialog open={promise !== null}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Select Account
                    </DialogTitle>
                    <DialogDescription>
                        Would you like to select an account for the transactions?
                    </DialogDescription>
                </DialogHeader>
                <CustomSelect 
                    placeholder="Select an account"
                    options={accountOptions}
                    onChange={(value) => selectValue.current = value}
                    disabled={accountsQuery.isLoading}
                    isCreatable={false}
                />
                <DialogFooter className="pt-2">
                    <Button 
                        onClick={handleCancel}
                        variant="outline"
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleConfirm}>
                        Confirm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );

    return [AccountDialog, confirm];
}
