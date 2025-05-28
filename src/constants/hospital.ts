import { ActivityIcon, BarChart, MessageSquareIcon, UserCogIcon, UsersIcon } from "lucide-react";
export const sidebar_items = [
  {
    href: "/hospital/home",
    icon: ActivityIcon,
    label: "Dashboard",
  },
  {
    href: "/hospital/employee",
    icon: UsersIcon,
    label: "Nhân viên",
  },
  {
    href: "/hospital/group",
    icon: MessageSquareIcon,
    label: "Group Chat",
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
];
