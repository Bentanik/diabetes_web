import { useQuery } from "@tanstack/react-query";
import { getHospitalStaffDetail } from "@/services/hospital-staff/api-services";

export const HOSPITAL_STAFF_DETAIL_QUERY_KEY = "hospital_staff_detail";

export const useGetHospitalStaffDetail = ({
    hospitalStaffId,
}: REQUEST.hospitalStaffId) => {
    const {
        data: hospital_staff_detail,
        isPending,
        isError,
        error,
    } = useQuery<
        TResponseData<API.TGetHospitalStaffDetail>,
        TMeta,
        API.TGetHospitalStaffDetail | null
    >({
        queryKey: [HOSPITAL_STAFF_DETAIL_QUERY_KEY, hospitalStaffId],
        queryFn: async () => {
            const res = await getHospitalStaffDetail({ hospitalStaffId });
            if (res.data == null) {
                throw new Error(
                    "No data returned from get hospital staff detail"
                );
            }
            return res as TResponseData<API.TGetHospitalStaffDetail>;
        },
        select: (data) => data.data,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: true,
    });

    return { hospital_staff_detail, isPending, isError, error };
};
