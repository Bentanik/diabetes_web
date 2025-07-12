declare namespace REQUEST {
    type ConversationsRequestParam = {
        cursor?: string;
        pageSize?: number;
        sort?: string;
        direction?: "asc" | "desc";
        search?: string;
    };

    type TCreateConversation = {
        name: string;
        members: string[];
    };
}

declare namespace API {
    type Conversation = {
        id: string;
        name: string;
        avatar: string;
        conversationType: number;
        members: [];
        modifiedDate: string;
    };

    type TGetConversations = Conversation[];
}
