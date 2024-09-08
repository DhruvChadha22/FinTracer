import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { BudgetsModel } from "@/prisma/zod";
import { convertAmountToMiliUnits } from "@/lib/utils";
import { useForm } from "react-hook-form";
import AmountInputBudget from "@/components/AmountInputBudget";
import DatePicker from "@/components/DatePicker";
import CustomSelect from "@/components/CustomSelect";
import { Trash } from "lucide-react";
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
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    categoryId: z.string().nullable().optional(),
}).refine((data) => data.endDate >= data.startDate, {
    path: ["endDate"]
});

const apiSchema = BudgetsModel.omit({
    id: true,
    userId: true
});

type FormValues = z.infer<typeof formSchema>;
type ApiFormValues = z.infer<typeof apiSchema>;

type Props = {
    id?: string;
    defaultValues?: FormValues;
    onSubmit: (values: ApiFormValues) => void;
    onDelete?: () => void;
    disabled?: boolean;
    categoryOptions: { label: string; value: string; }[];
    onCreateCategory: (name: string) => void;
};

export default function({
    id,
    defaultValues,
    onSubmit,
    onDelete,
    disabled,
    categoryOptions,
    onCreateCategory,
}: Props) {
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

    }

    const handleDelete = () => {
        onDelete?.();
    }

    return <Form {...form}>
        <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4 pt-4"
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
                            <AmountInputBudget
                                {...field}
                                placeholder="0.00"
                                disabled={disabled}
                            />
                        </FormControl>
                    </FormItem>
                )}
            />
            <FormField
                name="startDate"
                control={form.control}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            Start Date
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
                name="endDate"
                control={form.control}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            End Date
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
                {id ? "Save changes" : "Create budget"}
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
                    Delete budget
                </Button>
            )}
        </form>
    </Form>
}
