import React from "react";
import { Filters } from "@/components/Filters";
import { DataGrid } from "@/components/DataGrid";
import { DataCharts } from "@/components/DataCharts";

export default function OverviewPage() {
    return <div className="w-full pr-4">
        <h2 className="w-fit text-2xl lg:text-4xl font-semibold text-gray-900 mb-4">
            Welcome Back!
        </h2>
        <Filters />
        <DataGrid />
        <DataCharts />
    </div>
};
