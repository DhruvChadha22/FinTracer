import { Navbar } from "@/components/Navbar";
import { MainPage } from "@/components/MainPage";
import { KeyFeatures } from "@/components/KeyFeatures";
import { About } from "@/components/About";
import { ContactUs } from "@/components/ContactUs";
import { Footer } from "@/components/Footer";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function LandingPage() {
    const session = await auth();

    if (session) {
        redirect("/overview");
    }

    return <div className="flex flex-col min-h-[100dvh] bg-gray-900">
        <Navbar />
        <MainPage />
        <KeyFeatures />
        <About />
        <ContactUs />
        <Footer />
    </div>
};
