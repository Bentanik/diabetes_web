declare namespace REQUEST {
    type TCreateConversation = {
        name: string;
        avatarId?: string | null;
    };

    type ConversationsParams = {
        pageIndex?: number;
        pageSize?: number;
        search?: string;
        sortBy?: string;
        direction?: GenderType;
    };

    enum GenderType {
        asc = 0,
        desc = 1,
    }

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
        userIds: string[];
    };

    type AddDoctor = {
        doctorId: string;
    };

    type AddStaff = {
        adminId: string;
    };
}

declare namespace API {
    type Conversation = {
        id: string;
        name: string;
        avatar: string;
        conversationType: number;
        memberCount: number;
        modifiedDate: string;
    };

    type TGetConversations = {
        items: Conversation[];
        pageIndex: number;
        pageSize: number;
        totalCount: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };

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

    type ConversationDetail = {
        id: string;
        conversationId: string;
        fullName: string;
        avatar: string;
        phoneNumber: string;
        role: UserRole;
        invitedBy: string;
    };

    type TGetConversationDetail = {
        items: ConversationDetail[];
        pageIndex: number;
        pageSize: number;
        totalCount: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };

    enum UserRole {
        SystemAdmin = 0,
        Moderator = 1,
        HospitalStaff = 2,
        Doctor = 3,
        Patient = 4,
    }

    type ConversationId = {
        conversationId: string;
    };

    enum UserStatus {
        Available = 0,
        AlreadyInGroup = 1,
        Banned = 2,
        SystemBanned = 3,
    }
}
