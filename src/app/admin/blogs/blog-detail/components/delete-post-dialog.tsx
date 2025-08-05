"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import useDeletePost from "../../hooks/use-delete-blog";

interface DeletePostDialogProps {
    blogId: string;
    blogTitle: string;
}

export default function DeletePostDialog({
    blogId,
    blogTitle,
}: DeletePostDialogProps) {
    const [isOpenDialog, setIsDialogOpen] = useState(false);
    const { onSubmit: deleteSubmit, isPending: deletedPending } = useDeletePost(
        { blogId }
    );
    const router = useRouter();

    const handleFormSubmit = async () => {
        if (!deleteSubmit || typeof deleteSubmit !== "function") {
            return;
        }
        try {
            await deleteSubmit(() => {
                setIsDialogOpen(false);
                setTimeout(() => {
                    router.push("/admin/blogs");
                }, 1000);
            });
        } catch (error) {
            console.error("Error updating post:", error);
        }
    };

    return (
        <Dialog open={isOpenDialog} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="gap-2 cursor-pointer hover:bg-red-200 py-6 min-w-[180px]"
                >
                    <Trash className="w-4 h-4" />
                    Xóa bài viết
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-[1.5rem] font-medium">
                        Xóa bài viết
                    </DialogTitle>
                    <DialogDescription className="text-[1.1rem]">
                        Bạn có chắc chắn muốn xóa bài viết {blogTitle}
                    </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end gap-5">
                    <Button
                        variant="outline"
                        className="gap-2 cursor-pointer hover:border-gray-300 min-w-[100px]"
                        onClick={() => setIsDialogOpen(false)}
                    >
                        Hủy
                    </Button>
                    <Button
                        type="submit"
                        onClick={handleFormSubmit}
                        variant="outline"
                        className="gap-2 cursor-pointer hover:bg-red-200 hover:border-red-200"
                        disabled={deletedPending}
                    >
                        Xóa bài viết
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
