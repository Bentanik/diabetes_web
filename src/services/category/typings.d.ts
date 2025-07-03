declare namespace REQUEST {}

declare namespace API {
    type Category = {
        id: string;
        name: string;
        imageUrl: string;
        createdDate: string;
        isAddedToFavourite: boolean;
        numberOfPosts: number;
    };

    type TGetCategories = Category[];
}
