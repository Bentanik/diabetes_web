import {
    ActivityIcon,
    BarChart,
    BrainIcon,
    HospitalIcon,
    UserIcon,
    SquarePen,
    Plus,
    SquareChartGantt,
    UserRoundCog,
    Bot,
    BotMessageSquare,
    Columns3,
    Columns3Cog,
} from "lucide-react";
export const sidebar_items = [
    {
        href: "/admin/home",
        icon: ActivityIcon,
        label: "Dashboard",
    },
    {
        href: "/admin/hospital",
        icon: HospitalIcon,
        label: "Quản lý bệnh viện",
        subItems: [
            {
                label: "Quản lý bệnh viện",
                href: "/admin/hospital",
                icon: SquareChartGantt,
            },
            {
                label: "Tạo bệnh viện",
                href: "/admin/hospital/create-hospital",
                icon: Plus,
            },
        ],
    },

    {
        href: "/admin/package",
        icon: Columns3Cog,
        label: "Quản lý gói tư vấn",
        subItems: [
            {
                label: "Quản lý gói tư vấn",
                href: "/admin/package/manage-package",
                icon: SquareChartGantt,
            },
            {
                label: "Tạo gói tư vấn",
                href: "/admin/package/create-package",
                icon: Plus,
            },
        ],
    },
    {
        href: "/admin/users",
        icon: UserIcon,
        label: "Quản lý người dùng",
    },
    {
        href: "/admin/train-ai",
        icon: BrainIcon,
        label: "Huấn luyện AI",
        subItems: [
            {
                label: "Quản lý AI",
                href: "/admin/train-ai",
                icon: Bot,
            },
            {
                label: "Kiểm thử AI",
                href: "/admin/train-ai/chat",
                icon: BotMessageSquare,
            },
        ],
    },
    {
        href: "/mentor/setting",
        icon: BarChart,
        label: "Báo cáo",
    },
    {
        href: "/admin/blogs",
        icon: SquarePen,
        label: "Quản lý bài viết",
    },
];
