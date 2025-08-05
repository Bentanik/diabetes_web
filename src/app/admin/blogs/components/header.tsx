import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { BellIcon } from "lucide-react";
import { motion } from "framer-motion";
import ProfileHospitalMenu from "@/components/profile_hospital_menu";
import SearchInput from "@/components/search";
import useCreateBlog from "@/app/admin/blogs/hooks/use-create-blog";
import { useAppSelector } from "@/stores";

interface HeaderProps {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
}

const Header: React.FC<HeaderProps> = ({ searchTerm, setSearchTerm }) => {
    const { onSubmit } = useCreateBlog();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const user = useAppSelector((state) => state.userSlice);
    const isSystemAdmin = user.user?.roles?.includes("SystemAdmin");

    const handleCreateForm = () => {
        setIsSubmitting(true);
        try {
            onSubmit();
        } catch (err) {
            console.log(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white rounded-2xl p-6 border border-gray-200 mb-6 shadow-hospital"
        >
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--primary-color)]">
                        Quản lý bài viết
                    </h1>
                    <p className="text-gray-600 mt-1 text-sm">
                        Hiện có 6 kết quả hiển thị
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <SearchInput
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                    />
                    {!isSystemAdmin && (
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            variant="outline"
                            className="gap-2 cursor-pointer"
                            onClick={handleCreateForm}
                        >
                            {isSubmitting ? (
                                <div className="flex items-center gap-2">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{
                                            duration: 1,
                                            repeat: Infinity,
                                            ease: "linear",
                                        }}
                                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                    />
                                    Đang tạo...
                                </div>
                            ) : (
                                "Tạo bài post"
                            )}
                        </Button>
                    )}
                    <Button variant="ghost" size="icon">
                        <BellIcon className="w-5 h-5" />
                    </Button>
                    <div>
                        <ProfileHospitalMenu profile={1} />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Header;
