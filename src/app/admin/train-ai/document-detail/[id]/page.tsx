import DocumentDetailComponent from "@/app/admin/train-ai/document-detail/[id]/components";
import { use } from "react";

export default function DocumentDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);

    return (
        <div>
            <DocumentDetailComponent id={id} />
        </div>
    );
}
