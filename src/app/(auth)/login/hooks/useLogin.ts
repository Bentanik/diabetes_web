import { useBackdrop } from "@/context/backdrop_context";
import {
    loginSchema,
    LoginSchemaFormData,
} from "@/lib/validations/auth.schema";
import { useServiceLogin } from "@/services/auth/services";
import { useAppDispatch } from "@/stores";
import { clearAllRegister } from "@/stores/auth-slice";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export default function useLogin() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        setValue,
        reset,
    } = useForm<LoginSchemaFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const { mutate } = useServiceLogin();
    const { showBackdrop, hideBackdrop } = useBackdrop();
    const router = useRouter();
    const dispatch = useAppDispatch();

    const onSubmit = async (data: LoginSchemaFormData) => {
        try {
            const request: REQUEST.TLogin = {
                email: data?.email,
                password: data.password,
            };

            showBackdrop();
            mutate(request, {
                onSuccess: async (data) => {
                    if (data) {
                        hideBackdrop();
                        reset();
                        dispatch(clearAllRegister());
                        router.push("/admin/home");
                    }
                },
                onError: (error) => {
                    hideBackdrop();
                    if (error.errorCode === "auth13") {
                        setError("email", {
                            type: "manual",
                            message:
                                "Xin vui lòng kiểm tra lại địa chỉ email và mật khẩu",
                        });
                        setError("password", {
                            type: "manual",
                            message:
                                "Xin vui lòng kiểm tra lại địa chỉ email và mật khẩu",
                        });
                    }
                },
            });
        } catch (err) {
            console.log("err: ", err);
        }
    };

    return {
        register,
        handleSubmit,
        errors,
        onSubmit,
        setValue,
        setError,
    };
}
