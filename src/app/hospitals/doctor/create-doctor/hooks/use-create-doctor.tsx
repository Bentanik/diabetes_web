import { useBackdrop } from "@/context/backdrop_context";
import { useServiceCreateDoctor } from "@/services/hospital/services";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { GET_DOCTORS_QUERY_KEY } from "../../hooks/use-get-doctors";

export const doctorSchema = z.object({
    phoneNumber: z.string().regex(/^(0|\+84)\d{9,10}$/, {
        message:
            "Số điện thoại phải bắt đầu bằng 0 hoặc +84 và có 10 đến 11 chữ số",
    }),
    firstName: z.string().min(1, "Vui lòng nhập tên"),
    middleName: z.string().optional(),
    lastName: z.string().min(1, "Vui lòng nhập họ"),
    dateOfBirth: z
    .string({
        required_error: "Vui lòng chọn ngày sinh cho bác sĩ",
    })
    .min(1, "Vui lòng chọn ngày sinh cho bác sĩ")
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
        message: "Bác sĩ không được dưới 18 tuổi",
    }),
    gender: z.number(),
    avatarId: z.string().nonempty("Avatar là bắt buộc"),
    numberOfExperiences: z.preprocess(
        (val) => Number(val),
        z
            .number({
                required_error: "Vui lòng nhập số năm kinh nghiệm",
                invalid_type_error: "Vui lòng chỉ nhập số",
            })
            .min(0, "Số năm kinh nghiệm không được âm")
            .max(100, "Số năm kinh nghiêm không được vượt quá 100")
    ),

    position: z.number(),
    introduction: z.string().min(10, "Giới thiệu phải có ít nhất 10 ký tự"),
});

export type DoctorFormData = z.infer<typeof doctorSchema>;
export default function useCreateDoctor() {
    const form = useForm<DoctorFormData>({
        resolver: zodResolver(doctorSchema),
        defaultValues: {
            phoneNumber: "",
            firstName: "",
            middleName: "",
            lastName: "",
            dateOfBirth: "",
            gender: 0,
            avatarId: "",
            position: 0,
            introduction: "",
        },
    });

    const { mutate, isPending } = useServiceCreateDoctor();
    const { showBackdrop, hideBackdrop } = useBackdrop();
    const queryClient = useQueryClient();

    const onSubmit = (data: REQUEST.TCreateDoctor, onLoadData: () => void) => {
        showBackdrop();
        mutate(data, {
            onSuccess: async () => {
                hideBackdrop();
                onLoadData();
                await queryClient.invalidateQueries({
                    queryKey: [GET_DOCTORS_QUERY_KEY],
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
