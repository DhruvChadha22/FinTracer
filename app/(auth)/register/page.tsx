import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { SignUpCard } from "@/components/SignUpCard";

export default async function SignUpPage() {
    const session = await auth();

    if (session) {
        redirect("/overview");
    }

    return <SignUpCard />;
};
