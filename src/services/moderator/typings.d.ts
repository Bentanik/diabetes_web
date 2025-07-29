declare namespace REQUEST {
    type GetModeratorsCursorParams = {
        search?: string | null;
        gender?: GenderType | null;
        cursor?: string | "";
        pageSize?: number;
        sortBy: string;
        sortDirection: number;
    };

    enum GenderType {
        Male = 0,
        Female = 1,
    }
}

declare namespace API {
    type Moderators = {
        id: string;
        email: string;
        avatar: string;
        name: string;
        dateOfBirth: string;
        gender: GenderType;
        createdDate: string;
    };

    type TGetModeratorsCursor = {
        items: Moderators[];
        pageSize: number;
        nextCursor: string;
        hasNextPage: boolean;
    };

    enum GenderType {
        Male = 0,
        Female = 1,
    }
}
