import { useBackdrop } from "@/context/backdrop_context";
import { useServiceCreateHospital } from "@/services/hospital/services";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { GET_PACKAGES_QUERY_KEY } from "../../manage-package/hooks/use-get-packages";
import { useServiceCreatePackage } from "@/services/package/services";
import { useRouter } from "next/navigation";

export const packageSchema = z.object({
    name: z.string().min(3, "Vui lòng nhập tên gói (tối thiểu 3 ký tự)"),
    description: z.string().min(10, "Mô tả tối thiểu 10 ký tự"),
    price: z
        .number({ invalid_type_error: "Giá phải là số" })
        .min(1000, "Giá tối thiểu là 1,000 VNĐ"),
    sessions: z
        .number({ invalid_type_error: "Số lượt phải là số" })
        .int("Số lượt phải là số nguyên")
        .min(1, "Tối thiểu 1 lượt"),
    durationInMonths: z
        .number({ invalid_type_error: "Thời hạn phải là số" })
        .int("Thời hạn phải là số nguyên")
        .min(1, "Tối thiểu 1 tháng"),
});

export type PackageFormData = z.infer<typeof packageSchema>;
export default function useCreatePackage() {
    const form = useForm<PackageFormData>({
        resolver: zodResolver(packageSchema),
        defaultValues: {
            name: "",
            description: "",
            price: 0,
            sessions: 0,
            durationInMonths: 0,
        },
    });

    const { mutate, isPending } = useServiceCreatePackage();
    const { showBackdrop, hideBackdrop } = useBackdrop();
    const queryClient = useQueryClient();
    const router = useRouter();

    const onSubmit = (data: REQUEST.TCreatePackage) => {
        showBackdrop();
        mutate(data, {
            onSuccess: async () => {
                hideBackdrop();
                await queryClient.invalidateQueries({
                    queryKey: [GET_PACKAGES_QUERY_KEY],
                });
                form.reset();
                router.replace("/admin/package/manage-package");
            },
            onError: (err) => {
                hideBackdrop();
            },
        });
    };
    return {
        onSubmit,
        form,
        isPending,
    };
}
