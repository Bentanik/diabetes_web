import { useServiceCreateHospital } from "@/services/hospital/services";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";


export const hospitalSchema = z.object({
    name: z.string().min(2, "Tên bệnh viện phải có ít nhất 2 ký tự").max(100, "Tên bệnh viện không được quá 100 ký tự"),
    email: z.string().email("Email không hợp lệ"),
    contactNumber: z
        .string()
        .min(10, "Số điện thoại phải có ít nhất 10 số")
        .max(15, "Số điện thoại không được quá 15 số"),
    address: z.string().min(10, "Địa chỉ phải có ít nhất 10 ký tự").max(200, "Địa chỉ không được quá 200 ký tự"),
    description: z.string().max(500, "Mô tả không được quá 500 ký tự").optional(),
    establishedDate: z.date({
        required_error: "Vui lòng chọn ngày thành lập",
    }),
})

export type HospitalFormData = z.infer<typeof hospitalSchema>


export default function useCreateHospital() {
    const form = useForm<HospitalFormData>({
        resolver: zodResolver(hospitalSchema),
        defaultValues: {
            name: "",
            email: "",
            contactNumber: "",
            address: "",
            description: "",
        },
    });

    const { mutate, isPending } = useServiceCreateHospital();

    const onSubmit = (data: REQUEST.TCreateHospital, clearImages: () => void) => {
        try {

            mutate(data, {
                onSuccess: () => {
                    form.reset();
                    clearImages();
                },
            });
        } catch (err) {
            console.log(err);
        }
    };

    return {
        onSubmit,
        form,
        isPending,
    };
}