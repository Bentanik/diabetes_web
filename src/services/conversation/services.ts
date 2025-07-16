import { useMutation } from "@tanstack/react-query";
import {
    createConversationAsync,
    addMembersAsync,
    addDoctorAsync,
    addStaffAsync,
    deleteConversationAsync,
} from "./api-services";
import useToast from "@/hooks/use-toast";

export const useServiceCreateConversation = () => {
    const { addToast } = useToast();

    return useMutation<
        TResponseData<API.ConversationId>,
        TMeta,
        REQUEST.TCreateConversation
    >({
        mutationFn: async (data: REQUEST.TCreateConversation) => {
            const response = await createConversationAsync({
                name: data.name,
                avatarId: data.avatarId,
            });
            return response as TResponseData<API.ConversationId>;
        },
        onSuccess: () => {
            addToast({
                type: "success",
                description: "Tạo nhóm thành công",
                duration: 5000,
            });
        },
        onError: (err) => {
            const errorMessages = err.errors
                .flat()
                .map((e) => e.message)
                .join(", ");

            addToast({
                type: "error",
                description: errorMessages,
                duration: 5000,
            });
        },
    });
};

export const useServiceDeleteConversation = (groupId: string) => {
    const { addToast } = useToast();
    return useMutation<TResponse<object | null>, TMeta, void>({
        mutationFn: () => deleteConversationAsync(groupId),
        onSuccess: () => {
            addToast(
                {
                    type: "success",
                    description: "Xóa nhóm thành công",
                    duration: 5000,
                },

                false
            );
        },
        onError: (err) => {
            const errorMessages = err.errors
                .flat()
                .map((e) => e.message)
                .join(", ");

            addToast({
                type: "error",
                description: errorMessages,
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
                description: "Thêm bênh nhân vào nhóm thành công",
                duration: 5000,
            });
        },
        onError: () => {
            addToast({
                type: "error",
                description: "Thêm bênh nhân vào nhóm thất bại!",
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
                description: "Thêm bác sĩ vào nhóm thành công",
                duration: 5000,
            });
        },
        onError: () => {
            addToast({
                type: "error",
                description: "Thêm bác sĩ vào nhóm thất bại",
                duration: 5000,
            });
        },
    });
};

export const useServiceAddStaff = (groupId: string) => {
    const { addToast } = useToast();

    return useMutation<TResponse, TMeta, REQUEST.AddStaff>({
        mutationFn: async (data: REQUEST.AddStaff) => {
            const response = await addStaffAsync(groupId, {
                adminId: data.adminId,
            });
            return response as TResponse;
        },
        onSuccess: () => {
            addToast({
                type: "success",
                description: "Thêm nhân viên vào nhóm thành công",
                duration: 5000,
            });
        },
        onError: () => {
            addToast({
                type: "error",
                description: "Thêm nhân viên vào nhóm thất bại",
                duration: 5000,
            });
        },
    });
};
