
export default function AuthLayout({ children }: {
    children: React.ReactNode
}) {
    return <div className="bg-[url(/auth-bg.jpg)] bg-top bg-cover min-h-screen h-screen flex flex-col">
        <div className="z-[4] h-full w-full flex flex-col items-center justify-center">
            <div className="w-[420px]">
                {children}
            </div>
        </div>
        <div className="fixed inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.4),rgba(0,0,0,0),rgba(0,0,0,.4))] z-[1]" />
        <span className="absolute top-0 left-0 z-[4]">
            Designed by
            <meta name="referrer" content="no-referrer" />
            <a href="https://www.freepik.com/free-psd/3d-rendering-banking-sales-background_93563431.htm">&nbsp;Freepik</a>
        </span>
    </div>
};
