import Image from "next/image";
import Link from "next/link";

export const About = () => {
    return <div id="about" className="w-full py-12 md:py-24 lg:py-32 border-t border-emerald-600">
        <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
            <div className="space-y-2">
                <h2 className="text-3xl text-white font-bold tracking-tighter md:text-4xl/tight mb-4">About FinTracer</h2>
                <p className="max-w-[600px] text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    FinTracer is a powerful financial management tool designed to help individuals and small businesses
                    take control of their finances. With features like expense tracking, budgeting, and financial reporting,
                    and seamless integration with Bank accounts fetching real time balances and transactions data,
                    FinTracer makes it easy to stay on top of your financial goals.
                </p>
                <Link
                className="inline-flex h-10 items-center justify-center rounded-md bg-green-400 px-8 text-sm font-medium text-black shadow transition-colors hover:bg-green-600"
                href="/sign-in"
                >
                    Get Started
                </Link>
            </div>
            <div>
                <Image
                    alt="About"
                    className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
                    height={310}
                    src="/about-page.svg"
                    width={550}
                />
                <span className="flex justify-end mt-1 pr-4 text-xs text-muted">
                    Designed by
                    <meta name="referrer" content="no-referrer" />
                    <a href="https://www.freepik.com/free-vector/stock-market-analysis_9181562.htm#fromView=search&page=1&position=3&uuid=2ba5826a-b74b-4f17-b9bc-31049a5b424e">&nbsp;Freepik</a>
                </span>
            </div>
        </div>
  </div>
};
