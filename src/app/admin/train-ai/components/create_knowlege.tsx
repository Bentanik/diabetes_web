import useCreateKnowlegeBase from "@/app/admin/train-ai/hooks/useCreateKnowlegeBase"
import { Modal } from "@/components/shared/Modal"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import InputAuth from "@/components/input_auth"

interface CreateKnowlegeModalProps {
    isOpen: boolean
    onClose: () => void
}

export default function CreateKnowlegeModal({
    isOpen,
    onClose,
}: CreateKnowlegeModalProps) {
    const { register, handleSubmit, errors, onSubmit } = useCreateKnowlegeBase()

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Tạo thư mục mới">
            <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                onSubmit={handleSubmit((data) => onSubmit(data, onClose))}
                className="space-y-6"
            >
                {/* Input tên thư mục */}
                <div>
                    <InputAuth
                        type="text"
                        title="Tên thư mục"
                        register={register("name")}
                        error={errors.name?.message}
                    />
                </div>

                {/* Input mô tả */}
                <div>
                    <InputAuth
                        type="text"
                        title="Mô tả"
                        register={register("description")}
                        error={errors.description?.message}
                    />
                </div>

                {/* Buttons hành động */}
                <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={onClose}>
                        Hủy
                    </Button>
                    <Button
                        className="bg-blue-600 text-white hover:bg-blue-700"
                    >
                        Tạo thư mục
                    </Button>
                </div>
            </motion.form>
        </Modal>
    )
}