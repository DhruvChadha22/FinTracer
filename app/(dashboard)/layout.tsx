import { Appbar } from "@/components/Appbar";
import { Sidebar } from "@/components/Sidebar";
import { SheetProvider } from "@/providers/sheetProvider";
import { Toaster } from "@/components/ui/sonner";

export default function DashboardLayout({ children }: {
    children: React.ReactNode
}) {
    return <>
        <SheetProvider />
        <Toaster />
        <Appbar />
        <Sidebar />
        <div className="absolute inset-0 z-0 pl-7 pt-14 lg:pl-64 lg:pt-16 min-h-screen w-full h-fit bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-200 to-green-400">
            {children}
        </div>
    </>
}
