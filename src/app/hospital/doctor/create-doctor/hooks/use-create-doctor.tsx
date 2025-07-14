import { useBackdrop } from "@/context/backdrop_context";
import { useServiceCreateDoctor } from "@/services/doctor/services";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const doctorSchema = z.object({
    phoneNumber: z.string().min(8, "Số điện thoại không hợp lệ"),
    firstName: z.string().min(1, "Vui lòng nhập họ"),
    middleName: z.string().optional(),
    lastName: z.string().min(1, "Vui lòng nhập tên"),
    dateOfBirth: z
        .string()
        .refine((val) => !isNaN(Date.parse(val)), "Ngày sinh không hợp lệ"),
    gender: z.union([z.literal(0), z.literal(1)]),
    avatar: z.string().nonempty("Avatar là bắt buộc"),
    numberOfExperiences: z.number().min(0, "Số năm kinh nghiệm không hợp lệ"),
    position: z.number(),
    introduction: z.string().min(10, "Giới thiệu phải có ít nhất 10 ký tự"),
    images: z.array(z.string()).min(1, "Phải có ít nhất 1 hình ảnh"),
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
            gender: 1,
            avatar: "",
            numberOfExperiences: 0,
            position: 1,
            introduction: "",
            images: [],
        },
    });

    const { mutate, isPending } = useServiceCreateDoctor();

    const isPendingUpdate = isPending;
    const { showBackdrop, hideBackdrop } = useBackdrop();

    const onSubmit = (data: REQUEST.TCreateDoctor, clearImages: () => void) => {
        showBackdrop();
        mutate(data, {
            onSuccess: (res) => {
                hideBackdrop();
                console.log("API Success:", res);
                form.reset();
                clearImages();
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
        isPendingUpdate,
    };
}
