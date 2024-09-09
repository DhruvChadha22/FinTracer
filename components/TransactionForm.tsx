import { z } from "zod";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TransactionsModel } from "@/prisma/zod";
import { convertAmountToMiliUnits } from "@/lib/utils";
import { DatePicker } from "@/components/DatePicker";
import { AmountInputTxn } from "@/components/AmountInputTxn";
import { CustomSelect } from "@/components/CustomSelect";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";

const formSchema = z.object({
    name: z.string(),
    amount: z.string(),
    date: z.coerce.date(),
    accountId: z.string().nullable().optional(),
    categoryId: z.string().nullable().optional(),
}).refine((data) => data.date <= new Date(), {
    path: ["date"]
});

const apiSchema = TransactionsModel.omit({
    id: true,
    userId: true,
});

type FormValues = z.infer<typeof formSchema>;
type ApiFormValues = z.infer<typeof apiSchema>;

type Props = {
    id?: string;
    defaultValues?: FormValues;
    onSubmit: (values: ApiFormValues) => void;
    onDelete?: () => void;
    disabled?: boolean;
    accountOptions: { label: string; value: string; }[];
    categoryOptions: { label: string; value: string; }[];
    onCreateCategory: (name: string) => void;
};

export const TransactionForm = ({
    id,
    defaultValues,
    onSubmit,
    onDelete,
    disabled,
    accountOptions,
    categoryOptions,
    onCreateCategory,
}: Props) => {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues
    });

    const handleSubmit = (values: FormValues) => {
        const amount = parseFloat(values.amount);
        const amountInMiliUnits = convertAmountToMiliUnits(amount);

        onSubmit({
            ...values,
            amount: amountInMiliUnits,
        });
    };

    const handleDelete = () => {
        onDelete?.();
    };

    return <Form {...form}>
        <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4 pt-3"
        >
            <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            Name
                        </FormLabel>
                        <FormControl>
                            <Input 
                                disabled={disabled}
                                placeholder="Add a name"
                                {...field}
                            />
                        </FormControl>
                    </FormItem>
                )}
            />
            <FormField
                name="amount"
                control={form.control}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            Amount
                        </FormLabel>
                        <FormControl>
                            <AmountInputTxn
                                {...field}
                                placeholder="0.00"
                                disabled={disabled}
                            />
                        </FormControl>
                    </FormItem>
                )}
            />
            <FormField
                name="date"
                control={form.control}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            Date
                        </FormLabel>
                        <FormControl>
                            <DatePicker 
                                value={field.value}
                                onChange={field.onChange}
                                disabled={disabled}
                            />
                        </FormControl>
                    </FormItem>
                )}
            />
            <FormField
                name="accountId"
                control={form.control}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            Account
                        </FormLabel>
                        <FormControl>
                            <CustomSelect 
                                placeholder="Select a category"
                                options={accountOptions}
                                value={field.value}
                                isCreatable={false}
                                onChange={field.onChange}
                                disabled={disabled}
                            />
                        </FormControl>
                    </FormItem>
                )}
            />
            <FormField
                name="categoryId"
                control={form.control}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            Category
                        </FormLabel>
                        <FormControl>
                            <CustomSelect 
                                placeholder="Select a category"
                                options={categoryOptions}
                                onCreate={onCreateCategory}
                                isCreatable={true}
                                value={field.value}
                                onChange={field.onChange}
                                disabled={disabled}
                            />
                        </FormControl>
                    </FormItem>
                )}
            />
            <Button className="w-full" disabled={disabled}>
                {id ? "Save changes" : "Create transaction"}
            </Button>
            {!!id && (
                <Button
                type="button"
                disabled={disabled}
                onClick={handleDelete}
                className="w-full"
                variant="outline"
                >
                    <Trash className="size-4 mr-2"/>
                    Delete transaction
                </Button>
            )}
        </form>
    </Form>
};
