'use client'

import React from 'react'
import Header from '@/components/header';
import { motion } from "framer-motion";
import { Button } from '@/components/ui/button';
import BlurText from '@/components/ui/blur-text';
import { ChevronRight, Heart, Shield, Users, Sparkles, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Building2, UserCheck, Activity, Clock, MessageCircle, Brain, Plus, Minus } from 'lucide-react';
import Image from 'next/image';

const features = [
  {
    title: 'Cộng đồng hỗ trợ bệnh nhân',
    description:
      'Tham gia nhóm trò chuyện với các bệnh nhân đái tháo đường để chia sẻ kinh nghiệm, động viên tinh thần và kết nối cộng đồng.',
  },
  {
    title: 'Tư vấn trực tiếp với bác sĩ',
    description:
      'Đặt câu hỏi và nhận phản hồi từ bác sĩ chuyên khoa ngay trong ứng dụng. Hỗ trợ nhanh chóng, đáng tin cậy.',
  },
  {
    title: 'Trợ lý AI trong group chat',
    description:
      'AI tự động nhận diện câu hỏi trong nhóm và đưa ra câu trả lời ngay lập tức. Hỗ trợ 24/7, không cần rời khỏi khung chat.',
  },
  {
    title: 'Chia sẻ kiến thức sức khỏe',
    description:
      'Cung cấp bài viết, video và tài liệu giúp kiểm soát tiểu đường, cải thiện chế độ ăn và lối sống lành mạnh.',
  },
];

const Hero = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background với gradient đẹp và hiệu ứng */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        {/* Floating elements for visual appeal */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-indigo-200/20 rounded-full blur-3xl animate-bounce delay-500"></div>
      </div>

      <div className="relative z-10 flex items-center justify-between gap-x-9 md:px-[66px] lg:px-16 xl:px-24 py-12 md:py-20 font-be-vietnam-pro mx-auto">
        {/* Nội dung bên trái */}
        <motion.div
          className="w-full lg:w-[55%] py-8 rounded-2xl"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Sparkles className="w-4 h-4" />
            Công nghệ AI tiên tiến
          </motion.div>

          <BlurText
            text="Đồng hành cùng bệnh nhân đái tháo đường, mọi lúc – mọi nơi"
            delay={150}
            animateBy="words"
            direction="top"
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#248fca] bg-clip-text bg-gradient-to-r  from-blue-600 via-blue-700 to-cyan-600 leading-[1.2] font-be-vietnam-pro mb-6"
          />

          <motion.p
            className="text-lg md:text-xl leading-relaxed text-gray-600 max-w-[650px] mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <span className="text-[#248fca] font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text">
              DbDoctor
            </span>
            {" - "}
            Ứng dụng kết nối bác sĩ, bệnh nhân và trí tuệ nhân tạo để chăm sóc người bệnh đái tháo đường toàn diện hơn.
            Không chỉ là công nghệ, mà là người bạn đồng hành trong hành trình vì sức khỏe.
          </motion.p>

          {/* Feature highlights */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <div className="flex items-center gap-3 p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-blue-100">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Heart className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Chăm sóc 24/7</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-blue-100">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Bảo mật tuyệt đối</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-blue-100">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Kết nối bác sĩ</span>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.4 }}
          >
            <Button className="group h-[40px] relative px-8 py-4 bg-[#248fca] text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden cursor-pointer">
              <span className="relative z-10 flex items-center gap-2">
                Bắt đầu ngay
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-700 to-cyan-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Button>
            <Button variant="outline" className="px-8 py-4 h-[40px] border-2 border-blue-200 text-lg text-gray-600 font-semibold rounded-xl hover:bg-blue-50 hover:border-blue-300 hover:text-[#248fca] transition-all duration-300 cursor-pointer">
              Tìm hiểu thêm
            </Button>
          </motion.div>
        </motion.div>

        {/* Hình ảnh bên phải */}
        <motion.div
          className="hidden lg:flex flex-grow justify-end"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="relative">
            {/* Decorative elements */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-20 blur-xl"></div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full opacity-20 blur-xl"></div>

            <figure className="flex items-center justify-end gap-4">
              <motion.div
                className="relative"
                initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <Image
                  src="/images/home.jpg"
                  alt="Healthcare professional"
                  width={320}
                  height={500}
                  className="rounded-2xl object-cover shadow-2xl border border-white/20"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent rounded-2xl"></div>
              </motion.div>

              <motion.div
                className="relative"
                initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <Image
                  src="/images/home1.jpg"
                  alt="Medical consultation"
                  width={280}
                  height={320}
                  className="rounded-2xl object-cover shadow-xl border border-white/20"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/20 to-transparent rounded-2xl"></div>
              </motion.div>
            </figure>

            {/* Floating info cards */}
            <motion.div
              className="absolute top-8 -left-12 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-blue-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">24/7 Hỗ trợ</p>
                  <p className="text-xs text-gray-600">Luôn sẵn sàng</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="absolute bottom-8 -right-8 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-blue-100"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.5 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">An toàn 100%</p>
                  <p className="text-xs text-gray-600">Bảo mật tối đa</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Features Section
const FeaturesSection = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto px-6 md:px-10 lg:px-20">
        {/* Section Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#248fca] mb-4">
            Tính năng nổi bật
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            DbDoctor tích hợp AI và kiến thức y khoa giúp bệnh nhân tiểu đường nhận được hỗ trợ nhanh chóng, chính xác và nhân văn.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-3xl p-8 shadow-md border border-gray-100 flex flex-col md:flex-row items-center gap-8"
              initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.2 }}
              viewport={{ once: true }}
            >
              <div className="flex-1">
                <h3 className="text-2xl md:text-3xl font-bold text-[#248fca] mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                  {feature.description}
                </p>
              </div>
              <div className="flex-shrink-0">
                <Image
                  src="/images/phone_feature.png"
                  alt="feature"
                  width={200}
                  height={350}
                  className="rounded-[2rem] shadow-lg border border-white/20"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Who Is This For Section
const WhoIsThisForSection = () => {
  const targetGroups = [
    {
      title: "Bệnh viện và nhân viên y tế",
      icon: Building2,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
      features: [
        {
          icon: UserCheck,
          title: "Quản lý thông tin bệnh nhân dễ dàng",
          description: "Hệ thống giúp nhân viên y tế dễ dàng nhận, lưu trữ và tra cứu thông tin sức khỏe tiểu đường do bệnh nhân cung cấp."
        },
        {
          icon: Activity,
          title: "Theo dõi sức khỏe và lịch sử tư vấn",
          description: "Nhân viên y tế dễ dàng theo dõi chỉ số sức khỏe và lịch sử tư vấn từ dữ liệu bệnh nhân, giúp đưa ra quyết định điều trị chính xác hơn."
        },
        {
          icon: Brain,
          title: "Tăng hiệu quả chăm sóc bệnh nhân",
          description: "Công nghệ AI hỗ trợ chẩn đoán và giao tiếp tập trung"
        }
      ]
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
          description: "Kết nối với cộng đồng bệnh nhân, chia sẻ kinh nghiệm và động viên lẫn nhau"
        },
        {
          icon: MessageCircle,
          title: "Được tư vấn trực tiếp từ bác sĩ chuyên khoa",
          description: "Đặt câu hỏi và nhận phản hồi nhanh chóng từ đội ngũ bác sĩ"
        },
        {
          icon: Clock,
          title: "Nhận hỗ trợ nhanh từ trợ lý AI trong group chat",
          description: "AI thông minh hỗ trợ 24/7, trả lời tức thì mọi thắc mắc"
        }
      ]
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-200/10 rounded-full blur-3xl"></div>

      <div className="mx-auto px-6 md:px-12 lg:px-16 xl:px-24 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#248fca] mb-6">
            Dành cho ai?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            DbDoctor được thiết kế để phục vụ cả nhân viên y tế và bệnh nhân,
            tạo ra một hệ sinh thái chăm sóc sức khỏe toàn diện
          </p>
        </motion.div>

        {/* Target Groups */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {targetGroups.map((group, groupIndex) => (
            <motion.div
              key={groupIndex}
              className={`relative bg-gradient-to-br ${group.bgGradient} rounded-3xl p-8 shadow-lg border border-white/50 backdrop-blur-sm`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: groupIndex * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              {/* Group Header */}
              <div className="flex items-center gap-4 mb-8">
                <motion.div
                  className={`w-16 h-16 bg-gradient-to-r ${group.gradient} rounded-2xl flex items-center justify-center shadow-lg`}
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <group.icon className="w-8 h-8 text-white" />
                </motion.div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-800">
                    {group.title}
                  </h3>
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-6">
                {group.features.map((feature, featureIndex) => (
                  <motion.div
                    key={featureIndex}
                    className="flex items-start gap-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/30 hover:bg-white/80 transition-all duration-300"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: (groupIndex * 0.2) + (featureIndex * 0.1) }}
                    viewport={{ once: true }}
                    whileHover={{ x: 5 }}
                  >
                    <div className={`w-12 h-12 bg-gradient-to-r ${group.gradient} bg-opacity-20 rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <feature.icon className={`w-6 h-6 text-white ${group.gradient}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-800 mb-2">
                        {feature.title}
                      </h4>
                      <p className="text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// FAQ Section
const FAQSection = () => {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  const faqs = [
    {
      question: "DbDoctor có miễn phí không?",
      answer: "DbDoctor cung cấp miễn phí thông qua bệnh viện. Bệnh nhân sẽ được bệnh viện thêm vào và sử dụng ứng dụng."
    },
    {
      question: "AI của DbDoctor có đáng tin cậy không?",
      answer: "AI của chúng tôi được huấn luyện trên dữ liệu y khoa chính xác và luôn có bác sĩ giám sát. AI chỉ hỗ trợ tham khảo, không thay thế chẩn đoán của bác sĩ."
    },
    {
      question: "Thông tin cá nhân có được bảo mật không?",
      answer: "Chúng tôi cam kết bảo mật tuyệt đối thông tin sức khỏe của bạn, tuân thủ các tiêu chuẩn quốc tế với mã hóa end-to-end và GDPR."
    },
    {
      question: "Tôi có thể sử dụng DbDoctor trên điện thoại không?",
      answer: "Có, DbDoctor là ứng dụng dành cho điện thoại, có thể tải về trên App Store và Google Play."
    },
    {
      question: "Làm sao để bệnh viện hoặc bác sĩ tham gia vào hệ thống?",
      answer: "Bệnh viện và bác sĩ có thể đăng ký hợp tác với DbDoctor qua website hoặc liên hệ trực tiếp với đội ngũ hỗ trợ của chúng tôi."
    },
    {
      question: "Tôi có thể chia sẻ dữ liệu sức khỏe với bác sĩ khác không?",
      answer: "Dữ liệu của bạn chỉ được chia sẻ với các bác sĩ và nhân viên y tế trong hệ thống bệnh viện mà bạn đang điều trị, đảm bảo quyền riêng tư."
    },
    {
      question: "Ứng dụng có hỗ trợ nhiều loại bệnh khác ngoài tiểu đường không?",
      answer: "Hiện tại DbDoctor tập trung hỗ trợ quản lý và chăm sóc cho bệnh nhân tiểu đường. Chúng tôi đang nghiên cứu mở rộng thêm các bệnh lý khác trong tương lai."
    },
  ];


  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-blue-200/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-cyan-200/10 rounded-full blur-3xl"></div>

      <div className="mx-auto px-6 md:px-12 lg:px-16 xl:px-24 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#248fca] mb-4">
            Câu hỏi thường gặp
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Những thắc mắc phổ biến về DbDoctor
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="max-w-4xl mx-auto">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className="mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                <button
                  className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-blue-50 transition-colors duration-300"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                >
                  <h3 className="text-lg md:text-xl font-semibold text-gray-800 pr-4">
                    {faq.question}
                  </h3>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0"
                  >
                    {openIndex === index ? (
                      <Minus className="w-6 h-6 text-[#248fca]" />
                    ) : (
                      <Plus className="w-6 h-6 text-[#248fca]" />
                    )}
                  </motion.div>
                </button>

                <motion.div
                  initial={false}
                  animate={{
                    height: openIndex === index ? "auto" : 0,
                    opacity: openIndex === index ? 1 : 0
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-8 pb-6 pt-0">
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Footer Section
const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-[#248fca]/20 text-white overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-[#248fca]/10 to-cyan-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-l from-[#248fca]/15 to-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-t from-cyan-400/5 to-[#248fca]/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 mx-auto px-6 md:px-12 lg:px-16 xl:px-24 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-[#248fca] to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Heart className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-4xl font-bold bg-gradient-to-r from-[#248fca] to-cyan-400 bg-clip-text text-transparent">
                  DbDoctor
                </h3>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-lg">
                Đồng hành cùng bệnh nhân đái tháo đường với công nghệ AI tiên tiến và đội ngũ bác sĩ chuyên khoa hàng đầu.
                <span className="text-[#248fca] font-semibold"> Chăm sóc sức khỏe thông minh, tận tâm.</span>
              </p>
              <div className="space-y-4">
                <motion.div
                  className="flex items-center gap-4 p-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300"
                  whileHover={{ x: 5 }}
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-[#248fca] to-cyan-500 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Email</p>
                    <p className="text-white font-medium">contact@dbdoctor.vn</p>
                  </div>
                </motion.div>
                <motion.div
                  className="flex items-center gap-4 p-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300"
                  whileHover={{ x: 5 }}
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-[#248fca] to-cyan-500 rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Hotline</p>
                    <p className="text-white font-medium">1900 1234</p>
                  </div>
                </motion.div>
                <motion.div
                  className="flex items-center gap-4 p-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300"
                  whileHover={{ x: 5 }}
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-[#248fca] to-cyan-500 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Địa chỉ</p>
                    <p className="text-white font-medium">S2.05 Vinhome grandpark, Việt Nam</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h4 className="text-2xl font-bold mb-8 text-white relative">
              Liên kết nhanh
              <div className="absolute bottom-0 left-0 w-12 h-1 bg-gradient-to-r from-[#248fca] to-cyan-400 rounded-full"></div>
            </h4>
            <ul className="space-y-4">
              {[
                { name: 'Trang chủ', href: '#' },
                { name: 'Về chúng tôi', href: '#' },
                { name: 'Dịch vụ', href: '#' },
                { name: 'Bác sĩ', href: '#' },
                { name: 'Liên hệ', href: '#' },
                { name: 'Hỗ trợ', href: '#' }
              ].map((item, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <a
                    href={item.href}
                    className="text-gray-300 hover:text-[#248fca] transition-all duration-300 flex items-center gap-2 group"
                  >
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 text-[#248fca] transition-all duration-300" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{item.name}</span>
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Social Media & App Download */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h4 className="text-2xl font-bold mb-8 text-white relative">
              Kết nối với chúng tôi
              <div className="absolute bottom-0 left-0 w-12 h-1 bg-gradient-to-r from-[#248fca] to-cyan-400 rounded-full"></div>
            </h4>

            <div className="flex flex-wrap gap-3 mb-8">
              {[
                { icon: Facebook, href: "#", bgColor: "from-blue-600 to-blue-700", name: "Facebook" },
                { icon: Twitter, href: "#", bgColor: "from-sky-500 to-sky-600", name: "Twitter" },
                { icon: Instagram, href: "#", bgColor: "from-pink-500 to-rose-600", name: "Instagram" },
                { icon: Linkedin, href: "#", bgColor: "from-blue-700 to-blue-800", name: "LinkedIn" },
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  className={`w-12 h-12 bg-gradient-to-r ${social.bgColor} rounded-xl flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden`}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  title={social.name}
                >
                  <social.icon className="w-6 h-6 relative z-10" />
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </motion.a>
              ))}
            </div>

            <div className="bg-gradient-to-r from-[#248fca]/10 to-cyan-500/10 backdrop-blur-sm border border-[#248fca]/20 rounded-2xl p-6">
              <h5 className="text-white font-semibold mb-3">Tải ứng dụng DbDoctor</h5>
              <p className="text-gray-300 text-sm mb-4">Trải nghiệm đầy đủ trên mobile</p>
              <div className="flex flex-col gap-3">
                <Button className="w-full bg-gradient-to-r from-[#248fca] to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-white/20 rounded flex items-center justify-center">
                      <Image src="/images/appstore_icon.png" alt="App Store" width={24} height={24} />
                    </div>
                    <span>App Store</span>
                  </div>
                </Button>
                <Button variant="outline" className="w-full border-2 border-[#248fca]/50 text-[#248fca] hover:text-[#248fca] font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-white/20 rounded flex items-center justify-center">
                      <Image src="/images/chplay_icon.png" alt="Google Play" width={24} height={24} />
                    </div>
                    <span>Google Play</span>
                  </div>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          className="relative mt-16 pt-8 border-t border-white/10 text-center text-sm text-gray-400"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          viewport={{ once: true }}
        >
          © {new Date().getFullYear()} DbDoctor. All rights reserved.
        </motion.div>
      </div>
    </footer>
  );
};

export default function HomePage() {
  return (
    <div className='font-be-vietnam-pro overflow-x-hidden'>
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <main className="relative">
        <Hero />

        {/* Features Section */}
        <FeaturesSection />

        {/* Who Is This For Section */}
        <WhoIsThisForSection />

        {/* FAQ Section */}
        <FAQSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
