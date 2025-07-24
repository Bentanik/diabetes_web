import { useSendMessageService } from "@/services/chat/services";

export default function useSendMessage() {
  const { mutate, isPending, isError, error } = useSendMessageService();

  const sendMessage = (data: REQUEST.TSendMessage) => {
    mutate(data, {
      onSuccess: () => {
        console.log("Message sent successfully");
      },
    });
  };

  return { sendMessage, isPending, isError, error };
}
