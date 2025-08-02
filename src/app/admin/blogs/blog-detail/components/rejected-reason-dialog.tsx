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
import { BadgeX, CircleAlert } from "lucide-react";

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
                <DialogHeader className="">
                    <DialogTitle className="text-[1.5rem] font-medium">
                        Từ chối
                    </DialogTitle>
                    <div className="mt-5">
                        <div className="flex gap-2">
                            <BadgeX color="#a00808" width={20} />
                            <p className="text-[#a00808] font-medium">
                                Bị từ chối bởi lý do:{" "}
                            </p>
                        </div>
                        <p className="ml-2 mt-2">{reason}</p>
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
