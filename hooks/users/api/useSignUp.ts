import { toast } from "sonner";
import { client } from "@/lib/hono";
import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type ResponseType = InferResponseType<typeof client.api.users.$post>;
type RequestType = InferRequestType<typeof client.api.users.$post>["json"];

export const useSignUp = () => {
    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json) => {
            const res = await client.api.users.$post({ json });

            if (!res.ok) {
                throw new Error("Something went wrong");
            }

            return await res.json();
        },
        onSuccess: () => {
            toast.success("User created");
        },
    });

    return mutation;
};
