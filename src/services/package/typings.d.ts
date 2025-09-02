declare namespace REQUEST {
    type GetPackageParams = {
        search?: string;
        pageSize?: number;
        pageIndex?: number;
        isActive?: boolean;
        sortBy?: string;
        sortDirection: number;
    };

    type TCreatePackage = {
        name: string;
        description: string;
        price: number;
        sessions: number;
        durations: string;
    };
}

declare namespace API {
    type Package = {
        id: string;
        name: string;
        description: string;
        price: number;
        sessions: number;
        durations: string;
        isActive: boolean;
        createdDate: string;
    };

    type TGetPackages = {
        items: Package[];
        pageIndex: number;
        pageSize: number;
        totalCount: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
}
