declare namespace REQUEST {
  type TSendMessage = {
    user_id: string;
    session_id: string;
    message: string;
  };

  type TChatSession = {
    session_id: string
  }
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

  type TChatSession = {
      id: string,
      user_id: string,
      title: string,
      external_knowledge: boolean,
      created_at: string,
      updated_at: string
  }

  type TChatHistory = {
    session_id: string;
    messages: TChatMessage[];
  };
}
