"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import useReviewBlog, { ReviewFormData } from "../hooks/use-review-blog";

interface ReviewPostDialogProps {
    blogId: string;
}

export default function ReviewPostDialog({ blogId }: ReviewPostDialogProps) {
    const [isOpenDialog, setIsDialogOpen] = useState(false);
    const { onSubmit, form, isPending } = useReviewBlog({ blogId });
    const router = useRouter();

    const handleRejectBlog = (formData: ReviewFormData) => {
        try {
            const reviewData: REQUEST.ReviewBlog = {
                isApproved: false,
                reasonRejected: formData.reasonRejected,
            };
            onSubmit(reviewData);
            setIsDialogOpen(false);
            setTimeout(() => {
                router.push("/admin/blogs");
            }, 3000);
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
            setTimeout(() => {
                router.push("/admin/blogs");
            }, 3000);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <Dialog open={isOpenDialog} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button
                    onClick={() => setIsDialogOpen(true)}
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
                        onSubmit={form.handleSubmit(handleRejectBlog)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="reasonRejected"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Lý do từ chối</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Điền lý do từ chối bài viết"
                                            className="max-h-[400px] overflow-x-auto"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-end gap-5 mt-8">
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
                                {isPending ? "Đang xử lý..." : "Từ chối"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
            <Button
                onClick={handleApproveBlog}
                disabled={isPending}
                className="cursor-pointer px-6 py-6 min-w-[180px] bg-[#248FCA] hover:bg-[#2490cad8] text-white hover:text-white"
            >
                {isPending ? "Đang xử lý..." : "Duyệt bài viết"}
            </Button>
        </Dialog>
    );
}
