import { useMutation } from "@tanstack/react-query";
import {
    createConversationAsync,
    addMembersAsync,
    addDoctorAsync,
    deleteConversationAsync,
} from "./api-services";
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

export const useServiceDeleteConversation = (groupId: string) => {
    const { addToast } = useToast();
    return useMutation<TResponse<object | null>, TMeta, void>({
        mutationFn: () => deleteConversationAsync(groupId),
        onSuccess: (data) => {
            addToast(
                {
                    type: "success",
                    description: data.value.message,
                    duration: 5000,
                },
                false
            );
        },
        onError: () => {
            addToast({
                type: "error",
                description: "Xóa nhóm thất bại, vui lòng thử lại!",
                duration: 5000,
            });
        },
    });
};

export const useServiceAddMembers = (groupId: string) => {
    const { addToast } = useToast();

    return useMutation<TResponse, TMeta, REQUEST.AddMembers>({
        mutationFn: async (data: REQUEST.AddMembers) => {
            const response = await addMembersAsync(groupId, {
                userIds: data.userIds,
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

export const useServiceAddDoctor = (groupId: string) => {
    const { addToast } = useToast();

    return useMutation<TResponse, TMeta, REQUEST.AddDoctor>({
        mutationFn: async (data: REQUEST.AddDoctor) => {
            const response = await addDoctorAsync(groupId, {
                doctorId: data.doctorId,
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
