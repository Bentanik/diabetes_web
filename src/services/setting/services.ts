import {
    getChatSettingAsync,
    updateChatSettingAsync,
} from "@/services/setting/api-services";
import { TMeta, TResponse } from "@/typings";
import { useMutation, useQuery } from "@tanstack/react-query";

export const CHAT_SETTING_QUERY_KEY = "chat-setting";

export const useGetChatSettingService = () => {
    return useQuery({
        queryKey: [CHAT_SETTING_QUERY_KEY],
        queryFn: getChatSettingAsync,
        select: (data) => data.value.data,
    });
};

export const useUpdateChatSettingService = () => {
    return useMutation<TResponse, TMeta, REQUEST.TUpdateChatSettingRequest>({
        mutationFn: (data) => updateChatSettingAsync(data),
    });
};
