import Image from "next/image";

export const KeyFeatures = () => {
    return <div id="features" className="py-20 md:py-32 border-t border-emerald-600">
        <div className="container px-4 md:px-6 space-y-12">
            <div className="text-center space-y-4">
                <h2 className="inline-flex h-10 items-center justify-center p-6 rounded-lg bg-green-600 text-white shadow text-3xl font-bold">Key Features</h2>
                <p className="text-slate-200 text-muted-foreground max-w-3xl mx-auto">
                    FinTracer offers a comprehensive suite of tools to help you manage your finances with ease.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <FeatureCard 
                    heading="Financial Reporting"
                    text="Generate comprehensive financial reports to gain insights into your expenses."
                    src="/barchart-icon.svg"
                    alt="Barchart-Icon"
                />
                <FeatureCard 
                    heading="Expense Tracking"
                    text="Easily track and manage your expenses to stay on top of your finances."
                    src="/wallet-icon.svg"
                    alt="Wallet-Icon"
                />
                <FeatureCard 
                    heading="Budgeting"
                    text="Plan and manage your budget with our intuitive budgeting tools."
                    src="/calendar-icon.svg"
                    alt="Calendar-Icon"
                />
                <FeatureCard 
                    heading="Account Linking"
                    text="Link your bank accounts to ensure seamless addition of transactions automatically."
                    src="/receipt-icon.svg"
                    alt="Receipt-Icon"
                />
                <FeatureCard 
                    heading="Bulk Imports"
                    text="Add transactions in bulk using our CSV import feature."
                    src="/briefcase-icon.svg"
                    alt="Briefcase-Icon"
                />
                <FeatureCard 
                    heading="Analytics"
                    text="Gain valuable insights into your business performance with our advanced analytics tools."
                    src="/piechart-icon.svg"
                    alt="Piechart-Icon"
                />
            </div>
        </div>
    </div>
};

function FeatureCard({ heading, text, src, alt }: { heading: string, text: string, src: string, alt: string }) {
    return <div className="bg-gradient-to-b from-green-300 to-green-200 p-6 rounded-lg shadow-md hover:bg-white hover:scale-105 transition ease-in-out">
        <div className="bg-emerald-400 rounded-lg p-1 w-fit">
            <Image src={src} alt={alt} height={30} width={30} />
        </div>
        <h3 className="text-xl font-semibold mt-4 underline decoration-double decoration-green-500 decoration-2">{heading}</h3>
        <p className="text-muted-foreground mt-2">
            {text}
        </p>
    </div>
};
