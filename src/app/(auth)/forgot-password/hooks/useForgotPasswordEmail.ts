// import { useServiceForgotPasswordEmail } from "@/services/auth/services";
// import { setForgotPasswordEmail } from "@/stores/auth-slice";
// import { useAppDispatch, useAppSelector } from "@/stores/store";
import {
  forgotPasswordEmailBody,
  ForgotPasswordEmailBodyType,
} from "@/lib/validations/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export default function useForgotPasswordEmail() {
  // const dispatch = useAppDispatch();
  // const forgotPasswordState = useAppSelector(
  //   (state) => state.authSlice.forgotPassword
  // );
  // const { mutate, isPending } = useServiceForgotPasswordEmail();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    reset,
  } = useForm<ForgotPasswordEmailBodyType>({
    resolver: zodResolver(forgotPasswordEmailBody),
    defaultValues: {
      email: "",
    },
  });

  // const handleSubmitFormEmail = (email: string) => {
  //   dispatch(
  //     setForgotPasswordEmail({
  //       email: email,
  //       otp: forgotPasswordState.otp,
  //     })
  //   );
  // };

  const onSubmit = (data: ForgotPasswordEmailBodyType) => {
    try {
      console.log(data)
      // mutate(data, {
      //   onSuccess: async (data) => {
      //     handleSubmitFormEmail(`${data.value.data}`);
      //     reset();
      //   },
      //   onError: (error) => {
      //     if (error.errorCode.includes("auth_email")) {
      //       setError("email", {
      //         type: "manual",
      //         message: error.detail,
      //       });
      //     }
      //   },
      // });
    } catch (err) {
      console.log(err);
    }
  };
  return {
    register,
    errors,
    handleSubmit,
    onSubmit,
  };
}
