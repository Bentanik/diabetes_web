import { useQuery } from "@tanstack/react-query";
import { getDoctorDetail } from "@/services/doctor/api-services";
import { TMeta, TResponseData } from "@/typings";

export const DOCTOR_DETAIL_QUERY_KEY = "doctor_detail";

export const useGetDoctorDetail = ({ doctorId }: REQUEST.DoctorId) => {
    const {
        data: doctor_detail,
        isPending,
        isError,
        error,
    } = useQuery<
        TResponseData<API.TGetDoctorDetail>,
        TMeta,
        API.TGetDoctorDetail | null
    >({
        queryKey: [DOCTOR_DETAIL_QUERY_KEY, doctorId],
        queryFn: async () => {
            const res = await getDoctorDetail({ doctorId });
            if (res.data == null) {
                throw new Error("No data returned from getConversations");
            }
            return res as TResponseData<API.TGetDoctorDetail>;
        },
        select: (data) => data.data,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: true,
    });

    return { doctor_detail, isPending, isError, error };
};
