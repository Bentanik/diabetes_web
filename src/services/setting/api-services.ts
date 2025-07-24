import API_ENDPOINTS from "@/services/setting/api-path";
import request from "@/services/interceptor";

export const getChatSettingAsync = async () => {
  const response = await request<TResponse<API.TChatSetting>>(
    API_ENDPOINTS.SETTING_CHAT,
    {
      method: "GET",
    }
  );

  return response.data;
};

export const updateChatSettingAsync = async (
  data: REQUEST.TUpdateChatSettingRequest
) => {
  const response = await request<TResponse<API.TChatSetting>>(
    API_ENDPOINTS.SETTING_CHAT,
    {
      method: "PUT",
      data,
    }
  );

  return response.data;
};
