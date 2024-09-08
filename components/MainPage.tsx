import Link from "next/link";

export default function() {
    return <div className="text-white py-20 md:py-28">
        <div className="container px-4 md:px-6 grid gap-8 md:grid-cols-2 items-center">
            <div className="space-y-4">
                <h1 className="text-4xl font-bold">Streamline Your Finances with FinTracer</h1>
                <p className="text-lg text-gray-300">
                    FinTracer is a powerful tool that helps you track your expenses, create budgets, and generate financial reports.
                </p>
                <div className="flex gap-4">
                    <Link className="inline-flex h-10 items-center justify-center rounded-md bg-green-400 px-8 text-sm font-medium text-black shadow transition-colors hover:bg-green-600" href="/sign-in">
                        Get Started
                    </Link>
                    <Link className="inline-flex h-10 items-center justify-center rounded-md border border-green-400 bg-transparent px-8 text-sm font-medium shadow-sm transition-colors hover:bg-green-100 hover:text-black" href="#about">Learn More</Link>
                </div>
            </div>
            <div>
                <img
                    alt="Finance Tracking"
                    className="mx-auto rounded-lg"
                    height="400"
                    src="/finance-tracking.svg"
                    style={{
                    aspectRatio: "600/400",
                    objectFit: "cover",
                    }}
                    width="600"
                />
                <span className="flex justify-end mt-1 pr-8 text-xs text-muted">
                    Designed by
                    <meta name="referrer" content="no-referrer" />
                    <a href="https://www.freepik.com/free-vector/hand-drawn-stock-market-concept-with-coins_20058530.htm#fromView=search&page=1&position=22&uuid=2ba5826a-b74b-4f17-b9bc-31049a5b424e">&nbsp;Freepik</a>
                </span>
            </div>
        </div>
    </div>
}
