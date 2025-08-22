import {
    ActivityIcon,
    BarChart,
    MessageCircle,
    MessageSquareIcon,
    Plus,
    SquareChartGantt,
    User,
    UserCogIcon,
    UserRoundCog,
    UsersIcon,
} from "lucide-react";
export const sidebar_items = [
    {
        href: "/hospitals/home",
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
        href: "/hospitals/hospital-staff",
        icon: UserRoundCog,
        label: "Quản lý nhân viên",
        subItems: [
            {
                label: "Quản lý nhân viên",
                href: "/hospitals/hospital-staff",
                icon: SquareChartGantt,
            },
            {
                label: "Tạo nhân viên",
                href: "/hospitals/hospital-staff/create-hospital-staff",
                icon: Plus,
            },
        ],
    },
    {
        href: "/hospitals/dashboard",
        icon: MessageCircle,
        label: "Thống kê bác sĩ",
        subItems: [
            {
                label: "Quản lý tư vấn",
                href: "/hospitals/dashboard/consultation",
                icon: SquareChartGantt,
            },
        ],
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
            // {
            //     label: "Quản lý cuộc tư vấn",
            //     href: "/hospitals/consultation/schedule",
            //     icon: SquareChartGantt,
            // },
            {
                label: "Tạo lịch tư vấn",
                href: "/hospitals/consultation/create-consultation",
                icon: Plus,
            },
        ],
    },
];
