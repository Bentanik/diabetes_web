declare namespace REQUEST {
    export type TCreateBlog = {
        title: string;
        content: string;
        contentHtml: string;
        thumbnail: File;
        categoryIds: string[];
        images: string[];
        doctorId: string;
    };
}

declare namespace API {}
