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
                        if (data.data?.authUser.roles?.includes("SystemAdmin"))
                            return router.push("/admin/home");
                        else if (
                            data.data?.authUser.roles?.includes("Moderator")
                        )
                            return router.push("/admin/blogs");
                        else if (
                            data.data?.authUser.roles?.includes(
                                "HospitalStaff"
                            ) ||
                            data.data?.authUser.roles?.includes("HospitalAdmin")
                        )
                            return router.push("/hospitals/home");
                        return router.push("/");
                    }
                },

                onError: (error) => {
                    hideBackdrop();
                    error.errors?.forEach((error) => {
                        console.log(error);

                        if (error.code === "auth_error_13") {
                            setError("email", {
                                type: "manual",
                                message: error.message,
                            });
                        }
                        if (error.code === "auth_error_04") {
                            setError("password", {
                                type: "manual",
                                message: error.message,
                            });
                        }
                    });
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
