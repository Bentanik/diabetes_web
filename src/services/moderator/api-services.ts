import request from "@/services/interceptor";
import API_ENDPOINTS from "@/services/moderator/api-path";
import { TResponseData } from "@/typings";

export const getModerators = async ({
    sortBy = "name",
    sortDirection = 1,
    pageSize = 10,
    gender = 1,
    cursor = "",
    search = "",
}: REQUEST.GetModeratorsCursorParams) => {
    const params: Record<
        string,
        string | number | boolean | string[] | undefined
    > = {};
    // if (pageIndex !== null) {
    //     params.pageIndex = pageIndex;
    // }
    if (pageSize !== null) {
        params.pageSize = pageSize;
    }
    if (search && search.trim() !== "") {
        params.search = search.trim();
    }
    if (gender !== null) {
        params.gender = gender;
    }
    if (sortBy && sortBy.trim() !== "") {
        params.sortBy = sortBy.trim();
    }
    if (cursor && cursor.trim() !== "") {
        params.cursor = cursor.trim();
    }
    if (sortDirection !== undefined) {
        params.sortDirection = sortDirection;
    }
    const response = await request<TResponseData<API.TGetModeratorsCursor>>(
        API_ENDPOINTS.GET_MODERATORS,
        {
            method: "GET",
            params: Object.keys(params).length > 0 ? params : [],
        }
    );
    return response.data;
};
