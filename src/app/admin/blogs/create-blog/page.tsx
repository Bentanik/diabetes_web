import CreatePostForm from "@/app/admin/blogs/create-blog/components";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Thêm bệnh viện",
    description: "Thêm bệnh viện mới",
};

export default function CreateHospitalPage() {
    return (
        <div>
            <CreatePostForm />
        </div>
    );
}
