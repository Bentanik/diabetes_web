import { useQuery } from "@tanstack/react-query";
import { getHospital } from "@/services/hospital/api-services";
import { TMeta, TResponseData } from "@/typings";

export const HOSPITAL_DETAIL_QUERY_KEY = "hospital_detail";

export const useGetHospitalDetail = ({ hospitalId }: REQUEST.HospitalId) => {
    const {
        data: hospital_detail,
        isPending,
        isError,
        error,
    } = useQuery<
        TResponseData<API.TGetHospital>,
        TMeta,
        API.TGetHospital | null
    >({
        queryKey: [HOSPITAL_DETAIL_QUERY_KEY, hospitalId],
        queryFn: async () => {
            const res = await getHospital({ hospitalId });
            if (res.data == null) {
                throw new Error("No data returned from get hospital");
            }
            return res as TResponseData<API.TGetHospital>;
        },
        select: (data) => data.data,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: true,
    });

    return { hospital_detail, isPending, isError, error };
};
