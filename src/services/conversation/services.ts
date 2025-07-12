import { useMutation } from "@tanstack/react-query";
import { createConversationAsync } from "./api-services";
import useToast from "@/hooks/use-toast";

export const useServiceCreateConversation = () => {
    const { addToast } = useToast();

    return useMutation<TResponse, TMeta, REQUEST.TCreateConversation>({
        mutationFn: async (data: REQUEST.TCreateConversation) => {
            const response = await createConversationAsync({
                name: data.name,
                members: data.members,
            });
            return response as TResponse;
        },
        onSuccess: () => {
            addToast({
                type: "success",
                description: "Tạo nhóm thành công",
                duration: 5000,
            });
        },
        onError: () => {
            addToast({
                type: "error",
                description: "Tạo nhóm thất bại",
                duration: 5000,
            });
        },
    });
};
