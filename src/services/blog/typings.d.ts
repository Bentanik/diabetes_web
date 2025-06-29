declare namespace REQUEST {
    type TCreateBlog = {
        title: string;
        content: string;
        contentHtml: string;
        thumbnail: File;
        categoryIds: string[];
        images: string[];
        doctorId: string;
    };

    type BlogRequestParam = {
        SearchContent: string;
        CategoryIds: string[];
        Status: number;
        ModeratorId: string;
        DoctorId: string;
        IsAdmin: boolean;
        PageIndex: number;
        PageSize: number;
        SortType: string;
        IsSortAsc: boolean;
    };
}

declare namespace API {
    type Category = {
        id: string;
        name: string;
        imageUrl: string;
    };

    // GET BLOG type
    type Moderator = {
        id: string;
        fullName: string;
        imageUrl: string;
    };

    type Doctor = {
        id: string;
        fullName: string;
        imageUrl: string;
    };

    type Blog = {
        id: string;
        title: string;
        thumbnail: string;
        createdDate: string;
        view: number;
        like: number;
        categories: Category[];
        status: number;
        moderator: Moderator;
        doctor: Doctor;
    };

    type TGetBlogs = {
        items: Blog[];
        pageIndex: number;
        pageSize: number;
        totalCount: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
}
