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
