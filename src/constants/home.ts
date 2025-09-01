import {
    Activity,
    Brain,
    Building2,
    Heart,
    UserCheck,
    Users,
    MessageCircle,
    Clock,
} from "lucide-react";

export const HEADER_NAVIGATIONS = [
    {
        title: "Giới thiệu",
        href: "/#!",
    },
    {
        title: "Tính năng",
        href: "/#!",
    },
    {
        title: "Dành cho ai?",
        href: "/#!",
    },
    {
        title: "Câu hỏi thường gặp (FAQ)	",
        href: "/#!",
    },
    {
        title: "Về chúng tôi",
        href: "/#!",
    },
    {
        title: "Liên hệ",
        href: "/#!",
    },
];

export const FEATURES = [
    {
        title: "Cộng đồng hỗ trợ bệnh nhân",
        description:
            "Người bệnh có thể tham gia vào các nhóm trò chuyện, nơi mọi người cùng chia sẻ kinh nghiệm sống chung với bệnh tiểu đường, từ chế độ ăn uống, luyện tập cho đến cách duy trì tinh thần lạc quan. Đây là không gian an toàn, thân thiện giúp bệnh nhân cảm thấy được đồng hành, giảm bớt sự cô đơn và có thêm động lực trong quá trình điều trị.",
        image: "/images/phone1.jpg",
    },
    {
        title: "Tư vấn trực tiếp với bác sĩ",
        description:
            "Ứng dụng cho phép người dùng đặt câu hỏi và nhận phản hồi từ các bác sĩ chuyên khoa tiểu đường ngay trong khung chat. Bạn có thể dễ dàng trao đổi về tình trạng sức khỏe, phác đồ điều trị, chế độ ăn uống và các thắc mắc khác. Tính năng này giúp tiết kiệm thời gian, hỗ trợ nhanh chóng và mang lại cảm giác yên tâm khi có bác sĩ đồng hành mọi lúc.",
        image: "/images/phone4.jpg",
    },
    {
        title: "Thống kê sức khỏe hằng ngày",
        description:
            "Ứng dụng sẽ tự động ghi nhận và tổng hợp các chỉ số sức khỏe quan trọng như đường huyết, huyết áp, cân nặng và mức độ vận động. Người dùng có thể dễ dàng theo dõi sự thay đổi theo ngày, tuần hoặc tháng để hiểu rõ tình trạng cơ thể, từ đó điều chỉnh chế độ ăn uống và luyện tập cho phù hợp.",
        image: "/images/phone3.jpg",
    },
    {
        title: "Chia sẻ kiến thức sức khỏe",
        description:
            "Ứng dụng liên tục cập nhật các bài viết chuyên sâu, video hướng dẫn và tài liệu hữu ích liên quan đến bệnh tiểu đường. Người dùng có thể tìm thấy thông tin về cách kiểm soát đường huyết, xây dựng thực đơn khoa học, duy trì lối sống lành mạnh và những nghiên cứu mới nhất trong lĩnh vực y tế.",
        image: "/images/phone2.jpg",
    },
];

export const TARGET_GROUPS = [
    {
        title: "Bệnh viện và nhân viên y tế",
        icon: Building2,
        gradient: "from-blue-500 to-cyan-500",
        bgGradient: "from-blue-50 to-cyan-50",
        features: [
            {
                icon: UserCheck,
                title: "Quản lý thông tin bệnh nhân dễ dàng",
                description:
                    "Hệ thống giúp nhân viên y tế dễ dàng nhận, lưu trữ và tra cứu thông tin sức khỏe tiểu đường do bệnh nhân cung cấp.",
            },
            {
                icon: Activity,
                title: "Theo dõi sức khỏe và lịch sử tư vấn",
                description:
                    "Nhân viên y tế dễ dàng theo dõi chỉ số sức khỏe và lịch sử tư vấn từ dữ liệu bệnh nhân, giúp đưa ra quyết định điều trị chính xác hơn.",
            },
            {
                icon: Brain,
                title: "Tăng hiệu quả chăm sóc bệnh nhân",
                description:
                    "Công nghệ AI hỗ trợ chẩn đoán và giao tiếp tập trung",
            },
        ],
    },
    {
        title: "Bệnh nhân đái tháo đường",
        icon: Heart,
        gradient: "from-green-500 to-emerald-500",
        bgGradient: "from-green-50 to-emerald-50",
        features: [
            {
                icon: Users,
                title: "Tham gia cộng đồng chia sẻ kinh nghiệm",
                description:
                    "Kết nối với cộng đồng bệnh nhân, chia sẻ kinh nghiệm và động viên lẫn nhau",
            },
            {
                icon: MessageCircle,
                title: "Được tư vấn trực tiếp từ bác sĩ chuyên khoa",
                description:
                    "Đặt câu hỏi và nhận phản hồi nhanh chóng từ đội ngũ bác sĩ",
            },
            {
                icon: Clock,
                title: "Nhận hỗ trợ nhanh từ trợ lý AI trong group chat",
                description:
                    "AI thông minh hỗ trợ 24/7, trả lời tức thì mọi thắc mắc",
            },
        ],
    },
];

export const HOME_FAQ = [
    {
        question: "DbDoctor có miễn phí không?",
        answer: "DbDoctor cung cấp miễn phí thông qua bệnh viện. Bệnh nhân sẽ được bệnh viện thêm vào và sử dụng ứng dụng.",
    },
    {
        question: "AI của DbDoctor có đáng tin cậy không?",
        answer: "AI của chúng tôi được huấn luyện trên dữ liệu y khoa chính xác và luôn có bác sĩ giám sát. AI chỉ hỗ trợ tham khảo, không thay thế chẩn đoán của bác sĩ.",
    },
    {
        question: "Thông tin cá nhân có được bảo mật không?",
        answer: "Chúng tôi cam kết bảo mật tuyệt đối thông tin sức khỏe của bạn, tuân thủ các tiêu chuẩn quốc tế với mã hóa end-to-end và GDPR.",
    },
    {
        question: "Tôi có thể sử dụng DbDoctor trên điện thoại không?",
        answer: "Có, DbDoctor là ứng dụng dành cho điện thoại, có thể tải về trên App Store và Google Play.",
    },
    {
        question: "Làm sao để bệnh viện hoặc bác sĩ tham gia vào hệ thống?",
        answer: "Bệnh viện và bác sĩ có thể đăng ký hợp tác với DbDoctor qua website hoặc liên hệ trực tiếp với đội ngũ hỗ trợ của chúng tôi.",
    },
    {
        question: "Tôi có thể chia sẻ dữ liệu sức khỏe với bác sĩ khác không?",
        answer: "Dữ liệu của bạn chỉ được chia sẻ với các bác sĩ và nhân viên y tế trong hệ thống bệnh viện mà bạn đang điều trị, đảm bảo quyền riêng tư.",
    },
    {
        question:
            "Ứng dụng có hỗ trợ nhiều loại bệnh khác ngoài tiểu đường không?",
        answer: "Hiện tại DbDoctor tập trung hỗ trợ quản lý và chăm sóc cho bệnh nhân tiểu đường. Chúng tôi đang nghiên cứu mở rộng thêm các bệnh lý khác trong tương lai.",
    },
];
