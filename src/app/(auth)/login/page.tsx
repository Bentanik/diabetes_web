import LoginForm from "@/app/(auth)/login/components/login_form";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Đăng nhập",
    description: "Đăng nhập vào hệ thống",
};

export default function Login() {
    return (
        <div>
            <LoginForm />
        </div>
    );
}
