declare namespace REQUEST {}

declare namespace API {
    type Category = {
        id: string;
        name: string;
        imageUrl: string;
        createdDate: string;
    };

    type TGetCategories = Category[];
}
