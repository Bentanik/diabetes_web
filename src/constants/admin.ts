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
        href: "/admin/users",
        icon: UserIcon,
        label: "Quản lý người dùng",
    },
    {
        href: "/admin/train-ai",
        icon: BrainIcon,
        label: "Huấn luyện AI",
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
