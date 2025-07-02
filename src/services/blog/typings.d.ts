declare namespace REQUEST {
    type TUpdateBlog = {
        title: string;
        content: string;
        contentHtml: string;
        thumbnail: File;
        categoryIds: string[];
        images: string[];
        doctorId: string;
        isDraft: boolean;
    };

    type ReviewBlog = {
        isApproved: boolean;
        reasonRejected: string;
    };

    type BlogRequestParam = {
        searchContent: string;
        categoryIds: string[];
        status: BlogStatus;
        moderatorId: string;
        doctorId: string;
        isAdmin: boolean;
        pageIndex: number;
        pageSize: number;
        sortType: string;
        isSortAsc: boolean;
    };

    export type BlogId = {
        blogId: string;
    };

    enum BlogStatus {
        Draft = -2,
        Pending = 0,
        Approved = 1,
        Rejected = -1,
    }
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

    type TGetBlog = {
        id: string;
        title: string;
        content: string;
        contentHtml: string;
        thumbnail: string;
        createdDate: string;
        view: number;
        like: number;
        categories: Category[];
        status: number;
        moderator: Moderator;
        doctor: Doctor;
    };

    type TGetBlogId = {
        blogId: string;
    };
}
