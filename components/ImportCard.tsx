import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ImportTable from "@/components/ImportTable";
import { convertAmountToMiliUnits } from "@/lib/utils";
import { format, parse } from "date-fns";

const dateFormat = "yyyy-MM-dd HH:mm:ss";
const outputFormat = "yyyy-MM-dd";

const requiredOptions = [
    "name",
    "amount",
    "date",
];

interface SelectedColumnsState {
    [key: string]: string | null;
};

type Props = {
    data: string[][];
    onCancel: () => void;
    onSubmit: (data: any) => void;
};

export default function({
    data,
    onCancel,
    onSubmit,
}: Props) {
    const [selectedColumns, setSelectedColumns] = useState<SelectedColumnsState>({});

    const headers = data[0];
    const body = data.slice(1);

    const progress = Object.values(selectedColumns).filter(Boolean).length;

    const onTableHeadSelectChange = (columnIndex: number, value: string | null) => {
        setSelectedColumns((curr) => {
            const newSelectedColumns = {...curr};

            if (value === "skip") {
                value = null;
            }

            newSelectedColumns[`column_${columnIndex}`] = value;
            return newSelectedColumns;
        });
    };

    const handleContinue = () => {
        const mappedData = {
            headers: headers.map((_header, index) => {
                return selectedColumns[`column_${index}`] || null;
            }),
            body: body.map((row) => {
                const transformedRow = row.map((cell, index) => {
                    return selectedColumns[`column_${index}`] ? cell : null;
                });

                return transformedRow.every((item) => item === null) ? [] : transformedRow;
            }).filter((row) => row.length > 0)
        };

        const arrayOfData = mappedData.body.map((row) => {
            return row.reduce((acc: any, cell, index) => {
                const header = mappedData.headers[index];
                if (header !== null) {
                    acc[header] = cell;
                }

                return acc;
            }, {});
        });

        const formattedData = arrayOfData.map((item) => ({
            ...item,
            amount: convertAmountToMiliUnits(parseFloat(item.amount)),
            date: format(parse(item.date, dateFormat, new Date()), outputFormat),
        }));

        onSubmit(formattedData);
    };

    return <div className="w-full pr-4">
        <h2 className="w-fit text-2xl lg:text-4xl font-semibold text-gray-900">
            Transaction History
        </h2>
        <Card className="border-none drop-shadow-sm mt-8 min-h-[500px]">
            <CardHeader className="gap-y-2 md:flex-row md:items-center md:justify-between">
                <CardTitle className="text-xl line-clamp-1">
                    Import Transactions
                </CardTitle>
                <div className="flex flex-col md:flex-row items-center gap-2">
                    <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={onCancel} 
                        className="w-full"
                    >
                        Cancel
                    </Button>
                    <Button 
                        size="sm"
                        onClick={handleContinue}
                        disabled={progress < requiredOptions.length}
                        className="w-full"
                    >
                        Continue ({progress} / {requiredOptions.length})
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <ImportTable 
                    headers={headers}
                    body={body}
                    selectedColumns={selectedColumns}
                    onTableHeadSelectChange={onTableHeadSelectChange}
                />
            </CardContent>
        </Card>
    </div>
}
