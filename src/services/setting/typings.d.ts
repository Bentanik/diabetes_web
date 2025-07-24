declare namespace REQUEST {
  type TUpdateChatSettingRequest = {
    config: {
      enabled_kb_ids: string[];
    };
  };
}

declare namespace API {
  type TChatSetting = {
    id: string;
    name: string;
    config: {
      enabled_kb_ids: string[];
    };
    updated_at: string;
  };
}
