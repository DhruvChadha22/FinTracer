import { useCSVReader } from "react-papaparse";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
    onUpload?: (results: any) => void;
};

export default function({ onUpload }: Props) {
    const { CSVReader } = useCSVReader();

    return <CSVReader onUploadAccepted={onUpload}>
        {({ getRootProps }: any) => (
            <Button 
                size="sm"
                className="w-full md:w-auto"
                {...getRootProps()}   
            >
                <Upload className="size-4 mr-2" />
                Import CSV
            </Button>
        )}
    </CSVReader>
}
