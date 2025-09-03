/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useAppSelector } from "@/stores";

export default function ProfileHospitalMenu({ profile }: { profile: any }) {
    const userState = useAppSelector((state) => state.userSlice);

    return (
        <div className="relative font-be-vietnam-pro">
            {profile ? (
                <div className="w-13 h-13 rounded-full">
                    <img
                        src={userState.user?.avatarUrl || "/default-avatar.png"}
                        alt="Avatar"
                        className="w-full h-full rounded-full object-cover"
                    />
                </div>
            ) : null}
        </div>
    );
}
