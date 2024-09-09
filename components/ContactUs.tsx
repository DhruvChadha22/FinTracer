import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const ContactUs = () => {
    return <div id="contact" className="w-full py-12 md:py-24 lg:py-32 border-t border-emerald-600 text-white">
        <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Contact Us</h2>
                <p className="mx-auto max-w-[600px] text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Have a question or need help? Get in touch with our team.
                </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2">
                <form className="flex flex-col space-y-2">
                    <Input type="text" placeholder="Name" className="max-w-lg flex-1" />
                    <Input type="email" placeholder="Email" className="max-w-lg flex-1" />
                    <Textarea placeholder="Message" className="max-w-lg flex-1" />
                    <Button type="submit" className="bg-green-500 hover:bg-green-600 text-black">
                        Submit
                    </Button>
                </form>
            </div>
        </div>
    </div>
};
