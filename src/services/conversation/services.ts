import { useMutation } from "@tanstack/react-query";
import {
    createConversationAsync,
    addMembersAsync,
    addDoctorAsync,
    addStaffAsync,
    deleteConversationAsync,
    deleteParticipantAsync,
    updateConversationAsync,
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
            addToast({
                type: "error",
                description: err.title,
                duration: 5000,
            });
        },
    });
};

export const useServiceDeleteConversation = ({
    conversationId,
}: REQUEST.ConversationId) => {
    const { addToast } = useToast();
    return useMutation<TResponse<object | null>, TMeta, void>({
        mutationFn: () => deleteConversationAsync({ conversationId }),
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
            addToast({
                type: "error",
                description: err.title,
                duration: 5000,
            });
        },
    });
};

export const useServiceDeleteParticipant = (
    { conversationId }: REQUEST.ConversationId,
    { memberId }: REQUEST.MemberId
) => {
    const { addToast } = useToast();

    return useMutation<TResponse, TMeta>({
        mutationFn: async () => {
            const response = await deleteParticipantAsync(
                { conversationId },
                { memberId }
            );

            return response as TResponse;
        },
        onSuccess: () => {
            addToast({
                type: "success",
                description: "Xóa người dùng khỏi nhóm thành công",
                duration: 5000,
            });
        },
        onError: () => {
            addToast({
                type: "error",
                description: "Xóa người dùng khỏi nhóm thất bại!",
                duration: 5000,
            });
        },
    });
};

export const useServiceAddMembers = ({
    conversationId,
}: REQUEST.ConversationId) => {
    const { addToast } = useToast();

    return useMutation<TResponse, TMeta, REQUEST.AddMembers>({
        mutationFn: async (data: REQUEST.AddMembers) => {
            const response = await addMembersAsync(
                { conversationId },
                {
                    userIds: data.userIds,
                }
            );
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

export const useServiceAddDoctor = ({
    conversationId,
}: REQUEST.ConversationId) => {
    const { addToast } = useToast();

    return useMutation<TResponse, TMeta, REQUEST.AddDoctor>({
        mutationFn: async (data: REQUEST.AddDoctor) => {
            const response = await addDoctorAsync(
                { conversationId },
                {
                    doctorId: data.doctorId,
                }
            );
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

export const useServiceUpdateConversation = ({
    conversationId,
}: REQUEST.ConversationId) => {
    const { addToast } = useToast();

    return useMutation<TResponse, TMeta, REQUEST.TUpdateConversation>({
        mutationFn: async (data: REQUEST.TUpdateConversation) => {
            const response = await updateConversationAsync(
                { conversationId },
                {
                    name: data.name,
                    avatarId: data.avatarId,
                }
            );
            return response as TResponse;
        },
        onSuccess: () => {
            addToast({
                type: "success",
                description: "Cập nhật nhóm chat thành công",
                duration: 5000,
            });
        },
        onError: () => {
            addToast({
                type: "error",
                description: "Cập nhật nhóm chat thất bại",
                duration: 5000,
            });
        },
    });
};

export const useServiceAddStaff = ({
    conversationId,
}: REQUEST.ConversationId) => {
    const { addToast } = useToast();

    return useMutation<TResponse, TMeta, REQUEST.AddStaff>({
        mutationFn: async (data: REQUEST.AddStaff) => {
            const response = await addStaffAsync(
                { conversationId },
                {
                    adminId: data.adminId,
                }
            );
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
