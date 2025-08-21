import { useBackdrop } from "@/context/backdrop_context";
import { useServiceCreateHospital } from "@/services/hospital/services";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { GET_HOSPITALS_QUERY_KEY } from "../../hooks/use-get-hospitals";

export const hospitalSchema = z.object({
    name: z.string().min(1, "Tên bệnh viện là bắt buộc"),
    email: z.string().email("Email không hợp lệ"),
    phoneNumber: z.string().regex(/^(0|\+84)\d{9,10}$/, {
        message:
            "Số điện thoại phải bắt đầu bằng 0 hoặc +84 và có 10 đến 11 chữ số",
    }),
    website: z.string().url("Địa chỉ website không hợp lệ"),
    address: z.string().min(1, "Địa chỉ là bắt buộc"),
    introduction: z.string().min(10, "Giới thiệu phải có ít nhất 10 ký tự"),
    thumbnail: z.string().uuid("Thumbnail phải là UUID hợp lệ"),
    images: z.array(z.string().uuid("Mỗi ảnh phải là UUID hợp lệ")),
});

export type HospitalFormData = z.infer<typeof hospitalSchema>;
export default function useCreateHospital() {
    const form = useForm<HospitalFormData>({
        resolver: zodResolver(hospitalSchema),
        defaultValues: {
            name: "",
            email: "",
            phoneNumber: "",
            website: "",
            address: "",
            introduction: "",
            thumbnail: "",
            images: [],
        },
    });

    const { mutate, isPending } = useServiceCreateHospital();
    const { showBackdrop, hideBackdrop } = useBackdrop();
    const queryClient = useQueryClient();

    const onSubmit = (
        data: REQUEST.TCreateHospital,
        onLoadData: () => void
    ) => {
        showBackdrop();
        mutate(data, {
            onSuccess: async () => {
                hideBackdrop();
                onLoadData();
                await queryClient.invalidateQueries({
                    queryKey: [GET_HOSPITALS_QUERY_KEY],
                });
                form.reset();
            },
            onError: (err) => {
                hideBackdrop();
                console.log("API Fail:", err);
            },
        });
    };
    return {
        onSubmit,
        form,
        isPending,
    };
}
