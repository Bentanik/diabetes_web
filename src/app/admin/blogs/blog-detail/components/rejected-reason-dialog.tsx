"use client";

import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CircleAlert } from "lucide-react";

type PropReason = {
    reason: string;
};

export default function RejectedReason({ reason }: PropReason) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="destructive"
                    className="cursor-pointer bg-red-500"
                >
                    <CircleAlert />
                    Bài viết đã bị từ chối bởi Admin
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Lý do từ chối</DialogTitle>
                    <DialogDescription>
                        Vui lòng nhập lý do tại sao bạn từ chối yêu cầu này.
                        Thông tin này sẽ được gửi đến người yêu cầu.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="reason" className="text-right">
                            {reason}
                        </Label>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
