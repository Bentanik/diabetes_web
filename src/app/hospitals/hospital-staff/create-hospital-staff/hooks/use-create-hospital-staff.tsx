import { useBackdrop } from "@/context/backdrop_context";
import { useServiceCreateHospitalStaff } from "@/services/hospital-staff/services";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { GET_HOSPITAL_STAFFS_QUERY_KEY } from "../../hooks/use-get-hospital-staffs";

export const hospitalStaffSchema = z.object({
    firstName: z.string().min(1, "Vui lòng nhập tên"),
    middleName: z.string().optional(),
    lastName: z.string().min(1, "Vui lòng nhập họ"),
    dateOfBirth: z
        .string({
            required_error: "Vui lòng chọn ngày sinh cho nhân viên",
        })
        .min(1, "Vui lòng chọn ngày sinh cho nhân viên")
        .refine((v) => {
            const d = new Date(v);
            return !Number.isNaN(d.getTime());
        }, {
            message: "Ngày sinh không hợp lệ",
        })
        .refine((v) => {
            const d = new Date(v);
            const today = new Date();
            return d <= today;
        }, {
            message: "Ngày sinh không được ở tương lai",
        })
        .refine((v) => {
            const d = new Date(v);
            const today = new Date();
            let age = today.getFullYear() - d.getFullYear();
            const m = today.getMonth() - d.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < d.getDate())) {
                age--;
            }
            return age >= 18;
        }, {
            message: "Nhân viên không được dưới 18 tuổi",
        }),
    gender: z.number(),
    avatarId: z.string().nonempty("Avatar là bắt buộc"),
    email: z.string().email("Email không hợp lệ"),
});

export type HospitalStaffFormData = z.infer<typeof hospitalStaffSchema>;
export default function useCreateHospitalStaff() {
    const form = useForm<HospitalStaffFormData>({
        resolver: zodResolver(hospitalStaffSchema),
        defaultValues: {
            firstName: "",
            middleName: "",
            lastName: "",
            dateOfBirth: "",
            gender: 0,
            avatarId: "",
            email: "",
        },
    });

    const { mutate, isPending } = useServiceCreateHospitalStaff();
    const { showBackdrop, hideBackdrop } = useBackdrop();
    const queryClient = useQueryClient();

    const onSubmit = (
        data: REQUEST.TCreateHospitalStaff,
        onLoadData: () => void
    ) => {
        showBackdrop();
        mutate(data, {
            onSuccess: async () => {
                hideBackdrop();
                onLoadData();
                await queryClient.invalidateQueries({
                    queryKey: [GET_HOSPITAL_STAFFS_QUERY_KEY],
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
