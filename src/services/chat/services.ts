import {
  getChatHistoryAsync,
  sendMessageAsync,
} from "@/services/chat/api-services";
import { useMutation, useQuery } from "@tanstack/react-query";

export const CHAT_QUERY_KEY = "chat";

export const useGetChatHistoryService = ({
  session_id,
  limit = 20,
  skip = 0,
}: {
  session_id: string;
  limit?: number;
  skip?: number;
}) => {
  const {
    data: chat_history,
    isPending,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: [CHAT_QUERY_KEY, session_id, limit],
    queryFn: () => getChatHistoryAsync(session_id, limit, skip),
    select: (data) => data.value.data,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
  });

  return { chat_history, isPending, isError, error, refetch };
};

export const useSendMessageService = () => {
  return useMutation<
    TResponse<API.TChatMessageResponse>,
    TMeta,
    REQUEST.TSendMessage
  >({
    mutationFn: (data) => sendMessageAsync(data),
  });
};
