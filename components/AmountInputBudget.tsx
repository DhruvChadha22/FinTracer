import { PlusCircle } from "lucide-react";
import CurrencyInput from "react-currency-input-field";

type Props = {
    value: string;
    onChange: (value: string | undefined) => void;
    placeholder?: string;
    disabled?: boolean;
};

export default function({
    value,
    onChange,
    placeholder,
    disabled
}: Props) {
    return <div className="relative">
        <span
            className="absolute top-1.5 left-1.5 rounded-md p-2  flex items-center justify-center transition bg-emerald-500 hover:bg-emerald-600"
        >
            <PlusCircle className="size-3 text-white" />
        </span>
        <CurrencyInput 
            prefix="$"
            className="pl-10 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder={placeholder}
            value={value}
            allowNegativeValue={false}
            decimalsLimit={2}
            decimalScale={2}
            onValueChange={onChange}
            disabled={disabled}
        />
    </div>
}
