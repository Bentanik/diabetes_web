declare namespace REQUEST {
  type TSendMessage = {
    user_id: string;
    session_id: string;
    message: string;
  };
}

declare namespace API {
  type TChatMessageResponse = {
    answer: string;
  };

  type TChatMessage = {
    role: "user" | "assistant";
    content: string;
    created_at: string;
  };

  type TChatHistory = {
    session_id: string;
    messages: TChatMessage[];
  };
}
