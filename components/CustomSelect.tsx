"use client";

import { useMemo } from "react";
import { SingleValue } from "react-select";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";

type Props = {
    onChange: (value?: string) => void;
    onCreate?: (value: string) => void;
    isCreatable: boolean;
    options?: { label: string; value: string; }[];
    value?: string | null | undefined;
    disabled?: boolean;
    placeholder?: string;
};

export const CustomSelect = ({
    onChange,
    onCreate,
    options = [],
    value,
    isCreatable,
    disabled,
    placeholder,
}: Props) => {
    const onSelect = (option: SingleValue<{ label: string; value: string; }>) => {
        onChange(option?.value);
    };

    const formattedValue = useMemo(() => {
        return options.find((option) => option.value === value);
    }, [options, value]);


    return <div>
        {isCreatable 
            ? (
                <CreatableSelect 
                    placeholder={placeholder}
                    className="text-sm h-10"
                    styles={{
                        control: (base) => ({
                            ...base,
                            bordercolor: "#e2e8f0",
                            ":hover": {
                                borderColor: "#e2e8f0",
                            },
                        })
                    }}
                    value={formattedValue}
                    onChange={onSelect}
                    options={options}
                    onCreateOption={onCreate}
                    isDisabled={disabled}
                />
            )
            : (
                <Select 
                    placeholder={placeholder}
                    className="text-sm h-10"
                    styles={{
                        control: (base) => ({
                            ...base,
                            bordercolor: "#e2e8f0",
                            ":hover": {
                                borderColor: "#e2e8f0",
                            },
                        })
                    }}
                    value={formattedValue}
                    onChange={onSelect}
                    options={options}
                    isDisabled={disabled}
                />
            )
        }
    </div>
};
