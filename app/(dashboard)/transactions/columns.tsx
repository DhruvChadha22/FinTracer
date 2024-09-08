"use client"

import { ArrowUpDown } from "lucide-react"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

import { InferResponseType } from "hono";
import { client } from "@/lib/hono";
import { Actions } from "./actions"
import { format } from "date-fns"
import { cn, formatCurrency } from "@/lib/utils"
import CategoryColumn from "@/components/CategoryColumn"
import AccountColumn from "@/components/AccountColumn"

export type ResponseType = InferResponseType<typeof client.api.transactions.$get, 200>["data"][0];
type Props = {
    id: string | null;
    name: string;
};

export const columns: ColumnDef<ResponseType>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
            checked={
                table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Name
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
            )
        },
    },
    {
        accessorKey: "amount",
        header: ({ column }) => {
            return (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Amount
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
            )
        },
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("amount"));

            return <span className={cn(
                amount > 0 ? "text-emerald-600" : "text-rose-600"
            )}>
                {formatCurrency(amount)}
            </span>
        }
    },
    {
        accessorKey: "date",
        header: ({ column }) => {
            return (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Date
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
            )
        },
        cell: ({ row }) => {
            const date = row.getValue("date") as Date;

            return <span>{format(date, "dd MMMM, yyyy")}</span>
        }
    },
    {
        accessorKey: "account",
        header: ({ column }) => {
            return (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Account
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
            )
        },
        cell: ({ row }) => {
            const accountObj = row.getValue("account") as Props;

            return <AccountColumn
                id={row.original.id}
                account={accountObj?.name}
            />
        }
    },
    {
        accessorKey: "category",
        header: ({ column }) => {
            return (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Category
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
            )
        },
        cell: ({ row }) => {
            const categoryObj = row.getValue("category") as Props;

            return <CategoryColumn 
                id={row.original.id}
                category={categoryObj?.name}
                categoryId={categoryObj?.id}
                isTransaction={true}
            />
        }
    },
    {
        id: "actions",
        cell: ({ row }) => <Actions id={row.original.id} />
    }
];
