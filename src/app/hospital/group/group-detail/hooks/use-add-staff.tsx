import { useBackdrop } from "@/context/backdrop_context";
import { useServiceAddStaff } from "@/services/conversation/services";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const addStaffSchema = z.object({
    adminId: z.string().trim().min(1, "Phải chọn nhân viên để thêm vào"),
});

export type AddStaffFormData = z.infer<typeof addStaffSchema>;

export default function useAddDoctor(groupId: string) {
    const form = useForm<AddStaffFormData>({
        resolver: zodResolver(addStaffSchema),
        defaultValues: {
            adminId: "",
        },
    });

    const { mutate, isPending } = useServiceAddStaff(groupId);
    const { showBackdrop, hideBackdrop } = useBackdrop();

    const onSubmit = (data: REQUEST.AddStaff) => {
        showBackdrop();
        mutate(data, {
            onSuccess: (res) => {
                hideBackdrop();
                console.log("API Success:", res);
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
