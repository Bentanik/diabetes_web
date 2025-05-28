import { ActivityIcon, BarChart, BrainIcon, HospitalIcon, UserIcon } from "lucide-react";
export const sidebar_items = [
  {
    href: "/admin/home",
    icon: ActivityIcon,
    label: "Dashboard",
  },
  {
    href: "/admin/hospitals",
    icon: HospitalIcon,
    label: "Quản lý bệnh viện",
  },
  {
    href: "/admin/users",
    icon: UserIcon,
    label: "Quản lý người dùng",
  },
  {
    href: "/admin/train-ai",
    icon: BrainIcon,
    label: "Train AI",
  },
  {
    href: "/mentor/setting",
    icon: BarChart,
    label: "Báo cáo",
  }
];
