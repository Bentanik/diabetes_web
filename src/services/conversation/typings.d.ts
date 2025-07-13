declare namespace REQUEST {
    type TCreateConversation = {
        name: string;
        members: string[];
    };

    type UserAvailableRequestParam = {
        conversationId: string;
        role: string;
        pageIndex?: number;
        pageSize?: number;
        sortType?: string;
        isSortDesc?: boolean;
        search?: string;
    };

    type AddMembers = {
        userIds: [];
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

    type TGetUserAvailable = {
        items: UserAvailable[];
        pageIndex: number;
        pageSize: number;
        totalCount: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };

    type UserAvailable = {
        id: string;
        avatar: string;
        fullName: string;
        status: UserStatus;
        role: UserRole;
    };

    enum UserRole {
        SystemAdmin = 0,
        Moderator = 1,
        HospitalStaff = 2,
        Doctor = 3,
        Patient = 4,
    }

    enum UserStatus {
        Available = 0,
        AlreadyInGroup = 1,
        Banned = 2,
        SystemBanned = 3,
    }
}
