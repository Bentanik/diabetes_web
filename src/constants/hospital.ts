import {
    ActivityIcon,
    BarChart,
    MessageCircle,
    MessageSquareIcon,
    Plus,
    SquareChartGantt,
    User,
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
        subItems: [
            {
                label: "Quản lý bác sĩ",
                href: "/hospitals/doctor",
                icon: SquareChartGantt,
            },
            {
                label: "Tạo bác sĩ",
                href: "/hospitals/doctor/create-doctor",
                icon: Plus,
            },
        ],
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
        href: "/hospitals/consultation/create-consultation",
        icon: MessageCircle,
        label: "Quản lí cuộc tư vấn",
        subItems: [
            {
                label: "Quản lý lịch bác sĩ",
                href: "/hospitals/consultation/schedule",
                icon: SquareChartGantt,
            },
            {
                label: "Tạo lịch tư vấn",
                href: "/hospitals/consultation/create-consultation",
                icon: Plus,
            },
        ],
    },
];
