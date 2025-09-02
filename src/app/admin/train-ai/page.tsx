import { Metadata } from 'next';
import TrainAIComponent from "@/app/admin/train-ai/components";

export const metadata: Metadata = {
    title: "Huấn luyện AI",
    description: "Huấn luyện và cải thiện trí tuệ nhân tạo",
};

export default function TrainAI() {
    return (
        <div>
            <TrainAIComponent />
        </div>
    )
}
