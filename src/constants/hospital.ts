import {
    ActivityIcon,
    BarChart,
    MessageCircle,
    MessageSquareIcon,
    UserCogIcon,
    UsersIcon,
} from "lucide-react";
export const sidebar_items = [
    {
        href: "/hospital/home",
        icon: ActivityIcon,
        label: "Dashboard",
    },
    {
        href: "/hospitals/doctor",
        icon: UsersIcon,
        label: "Bác sĩ",
    },
    {
        href: "/hospitals/conversation",
        icon: MessageSquareIcon,
        label: "Nhóm Chat",
    },
    {
        href: "/mentor/setting",
        icon: BarChart,
        label: "Báo cáo",
    },
    {
        href: "/mentor/setting",
        icon: UserCogIcon,
        label: "Quản lí tài khoản",
    },
    {
        href: "/hospitals/consultation",
        icon: MessageCircle,
        label: "Quản lí cuộc tư vấn",
    },
];
