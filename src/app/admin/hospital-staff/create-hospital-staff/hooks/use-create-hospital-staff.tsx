import { useBackdrop } from "@/context/backdrop_context";
import { useServiceCreateHospitalStaff } from "@/services/hospital-staff/services";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { GET_HOSPITAL_STAFFS_QUERY_KEY } from "../../hooks/use-get-hospital-staffs";

export const hospitalStaffSchema = z.object({
    firstName: z.string().min(1, "Vui lòng nhập họ"),
    middleName: z.string().optional(),
    lastName: z.string().min(1, "Vui lòng nhập tên"),
    dateOfBirth: z.string().min(1, "Vui lòng chọn ngày sinh cho nhân viên"),
    gender: z.number(),
    avatarId: z.string().nonempty("Avatar là bắt buộc"),
    hospitalId: z.string().min(1, "Vui lòng chọn bệnh viện"),
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
            hospitalId: "",
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
