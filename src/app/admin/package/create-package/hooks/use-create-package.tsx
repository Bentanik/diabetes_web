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
        .union([z.string(), z.number()])
        .transform((val) => (typeof val === "string" ? Number(val) : val))
        .refine(
            (val) => !isNaN(val) && val >= 1000,
            "Giá tối thiểu là 1,000 VNĐ"
        ),
    sessions: z
        .union([z.string(), z.number()])
        .transform((val) => (typeof val === "string" ? Number(val) : val))
        .refine(
            (val) => !isNaN(val) && Number.isInteger(val) && val >= 1,
            "Số lượt phải là số nguyên tối thiểu 1"
        ),
    durations: z.string().refine((val) => {
        const num = Number(val);
        return !isNaN(num) && Number.isInteger(num) && num >= 1;
    }, "Thời hạn phải là số nguyên tối thiểu 1"),
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
            durations: "",
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
