import {
    type CreateKnowledgeBaseFormData,
    createKnowledgeBaseSchema,
} from "@/lib/validations/knowledge_base.schema";
import {
    DOCUMENTS_QUERY_KEY,
    useTrainDocumentService,
} from "@/services/train-ai/services";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { useBackdrop } from "@/context/backdrop_context";
import { useNotification } from "@/context/notification_context";

export default function useTrainDocument() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        setValue,
        reset,
        watch,
    } = useForm<CreateKnowledgeBaseFormData>({
        resolver: zodResolver(createKnowledgeBaseSchema),
        defaultValues: {
            name: "",
            description: "",
        },
    });

    const { mutate } = useTrainDocumentService();
    const queryClient = useQueryClient();
    const { addNotification } = useNotification()

    const backdrop = useBackdrop()

    const onSubmit = async (id: string) => {
        backdrop.showBackdrop()
        mutate({
            document_id: id,
        }, {
            onSuccess: () => {
                backdrop.hideBackdrop()
                queryClient.invalidateQueries({
                    queryKey: [DOCUMENTS_QUERY_KEY],
                })
                addNotification({
                    type: "success",
                    title: "Thành công",
                    message: "Dữ liệu sẽ được huấn luyện",
                    duration: 5000,
                })
            },
            onError: () => {
                backdrop.hideBackdrop()
            }
        })
    }

    return {
        register,
        handleSubmit,
        errors,
        onSubmit,
        setValue,
        setError,
        watch,
        reset,
    };
}
