import React from "react";
import { Metadata } from 'next';
import ModeratorManageBlogComponent from "./components/index";

export const metadata: Metadata = {
    title: "Quản lý Blog",
    description: "Quản lý và điều chỉnh nội dung blog",
};

export default function ModeratorManageBlog() {
    return (
        <div>
            <ModeratorManageBlogComponent />
        </div>
    );
}
