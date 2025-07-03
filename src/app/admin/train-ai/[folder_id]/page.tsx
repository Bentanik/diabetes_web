import TrainAIFolderComponent from "@/app/admin/train-ai/[folder_id]/components";

export default function TrainAIFolderPage({ params }: { params: { folder_id: string } }) {
    return (
        <div>
            <TrainAIFolderComponent folderId={params.folder_id} />
        </div>
    )
}
