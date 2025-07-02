"use client";

import React, { useState, useEffect } from "react";
import useGetBlog from "../hooks/use-get-blog";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Toaster } from "sonner";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import useReviewBlog, { ReviewFormData } from "../hooks/use-review-blog";
import { useRouter } from "next/navigation";

export default function BlogDetail({ blogId }: REQUEST.BlogId) {
    const { getBlogApi, isBlogPending } = useGetBlog();
    const [data, setData] = useState<API.TGetBlog>();
    const { onSubmit, form, isPending } = useReviewBlog({ blogId: blogId });
    const router = useRouter();
    useEffect(() => {
        const handleGetData = async (id: string) => {
            try {
                const res = await getBlogApi({ blogId: id });
                setData(res?.data);
            } catch (err) {
                console.log(err);
            }
        };
        handleGetData(blogId);
    }, []);

    const handleRejectBlog = (formData: ReviewFormData) => {
        try {
            const reviewData: REQUEST.ReviewBlog = {
                isApproved: false,
                reasonRejected: formData.reasonRejected,
            };
            onSubmit(reviewData);
            router.push("/admin/blogs");
        } catch (err) {
            console.log(err);
        }
    };

    const handleApproveBlog = () => {
        try {
            const reviewData: REQUEST.ReviewBlog = {
                isApproved: true,
                reasonRejected: "",
            };
            onSubmit(reviewData);
            router.push("/admin/blogs");
        } catch (err) {
            console.log(err);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();

        return `${day}-${month}-${year}`;
    };

    return (
        <div>
            {isBlogPending && <div>...Loading</div>}
            <Toaster position="top-right" toastOptions={{ duration: 5000 }} />
            <div className="mt-5 py-[2%] px-[10%] bg-[#ffffff] shadow-2xl rounded-2xl">
                {/*Header*/}
                <div>
                    <h1 className="text-[2.7rem] font-bold leading-[49px]">
                        {data?.title}
                    </h1>
                    <div className="flex mt-4 items-center gap-3">
                        <Image
                            src={data?.doctor.imageUrl ?? "/images/auth1.jpg"}
                            alt="doctor-avatar"
                            width={50}
                            height={50}
                            className="w-[50px] h-[50px] rounded-full object-cover"
                        />
                        <div>
                            <p className="font-medium">
                                {data?.doctor.fullName}
                            </p>
                            <p className="text-gray-400">
                                {data?.createdDate
                                    ? formatDate(data.createdDate)
                                    : "Không hiển thị ngày đăng"}
                            </p>
                        </div>
                    </div>
                    {/* Uncomment if you want to show thumbnail */}
                    {/* <div className="mt-4">
                        <Image
                            src={data?.thumbnail ?? "/images/auth1.jpg"}
                            alt="blog-thumbnail"
                            width={800}
                            height={500}
                            className="w-full h-[500px] rounded-2xl object-cover"
                        />
                    </div> */}
                </div>

                {/* Main Content */}
                <div
                    className="mt-6 prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{
                        __html: data?.contentHtml || "",
                    }}
                />

                {/* Actions for rejected blog (status: -2) */}
                {data?.status === -2 && (
                    <div className="mt-10 flex justify-end gap-4">
                        <Button
                            variant="outline"
                            className="cursor-pointer px-6 py-6 min-w-[180px] hover:border-red-500 hover:text-red-500"
                        >
                            Xóa bài viết
                        </Button>
                        <Link href={`/admin/blogs/edit/${blogId}`}>
                            <Button
                                variant="outline"
                                className="cursor-pointer px-6 py-6 min-w-[180px] bg-[#248FCA] hover:bg-[#2490cad8] text-white hover:text-white"
                            >
                                Chỉnh sửa bài viết
                            </Button>
                        </Link>
                    </div>
                )}

                {/* Actions for pending blog (status: 0) */}
                {data?.status === 0 && (
                    <div className="mt-10 flex justify-end gap-4">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="cursor-pointer px-6 py-6 min-w-[180px] hover:border-red-500 hover:text-red-500"
                                >
                                    Từ chối bài viết
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle className="text-[1.5rem]">
                                        Từ chối bài viết
                                    </DialogTitle>
                                </DialogHeader>

                                <Form {...form}>
                                    <form
                                        onSubmit={form.handleSubmit(
                                            handleRejectBlog
                                        )}
                                        className="space-y-4"
                                    >
                                        <FormField
                                            control={form.control}
                                            name="reasonRejected"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Lý do từ chối
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Điền lý do từ chối bài viết"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <DialogFooter className="mt-8">
                                            <DialogClose asChild>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    className="cursor-pointer"
                                                >
                                                    Hủy
                                                </Button>
                                            </DialogClose>
                                            <Button
                                                type="submit"
                                                disabled={isPending}
                                                className="cursor-pointer bg-red-500 hover:bg-red-600"
                                            >
                                                {isPending
                                                    ? "Đang xử lý..."
                                                    : "Từ chối"}
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </Form>
                            </DialogContent>
                        </Dialog>

                        <Button
                            onClick={handleApproveBlog}
                            disabled={isPending}
                            className="cursor-pointer px-6 py-6 min-w-[180px] bg-[#248FCA] hover:bg-[#2490cad8] text-white hover:text-white"
                        >
                            {isPending ? "Đang xử lý..." : "Duyệt bài viết"}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
