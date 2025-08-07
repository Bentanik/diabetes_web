import { getHospitalStaffs } from "@/services/hospital-staff/api-services";
import { useQuery } from "@tanstack/react-query";

export const GET_HOSPITAL_STAFFS_QUERY_KEY = "hospital_staffs";

export const useGetHospitalStaffs = (
    params: REQUEST.GetHospitalStaffsParams
) => {
    const {
        data: hospital_staffs,
        isPending,
        isError,
        error,
    } = useQuery<
        TResponseData<API.TGetHospitalStaffs>,
        TMeta,
        API.TGetHospitalStaffs
    >({
        queryKey: [GET_HOSPITAL_STAFFS_QUERY_KEY, params],
        queryFn: async () => {
            const res = await getHospitalStaffs(params);
            if (res.data == null) {
                throw new Error("No data returned from get doctors");
            }
            return res as TResponseData<API.TGetHospitalStaffs>;
        },

        select: (data) =>
            data.data ?? {
                items: [],
                pageIndex: 0,
                pageSize: 0,
                totalCount: 0,
                totalPages: 0,
                hasNextPage: false,
                hasPreviousPage: false,
            },
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: true,
    });

    return { hospital_staffs, isPending, isError, error };
};
