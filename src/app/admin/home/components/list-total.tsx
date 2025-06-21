import HospitalBox from "@/components/hospital_box";
import {
    BotIcon,
    MessageCircleIcon,
    MessageSquareIcon,
    UsersIcon,
} from "lucide-react";

const START_CARDS = [
    {
        title: "Tổng số nhân viên",
        value: "156",
        change: "+12",
        changeText: "so với tháng trước",
        positive: true,
        color: "#248fca",
        icon: UsersIcon,
    },
    {
        title: "Thành viên trong group",
        value: "2,847",
        change: "+234",
        changeText: "thành viên mới tháng này",
        positive: true,
        color: "#10b981",
        icon: MessageSquareIcon,
    },
    {
        title: "Tương tác AI hôm nay",
        value: "1,289",
        change: "+15%",
        changeText: "so với hôm qua",
        positive: true,
        color: "#8b5cf6",
        icon: BotIcon,
    },
    {
        title: "Tin nhắn mới hôm nay",
        value: "1,247",
        change: "+8%",
        changeText: "so với hôm qua",
        positive: true,
        color: "#f97316",
        icon: MessageCircleIcon,
    },
];

export default function ListTotalStatisticHospitalDashboard() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {START_CARDS.map((card, index) => (
                <HospitalBox
                    key={index}
                    title={card.title}
                    value={card.value}
                    icon={card.icon}
                    unit={""}
                    changeText={card.changeText}
                    change={card.change}
                    positive={card.positive}
                    color={card.color}
                />
            ))}
        </div>
    );
}
