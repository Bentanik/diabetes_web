import TrainAIFolderComponent from "@/app/admin/train-ai/[folder_id]/components";

export default async function TrainAIFolderPage({
    params,
}: {
    params: Promise<{ folder_id: string }>;
}) {
    const { folder_id } = await params;

    return (
        <div>
            <TrainAIFolderComponent folderId={folder_id} />
        </div>
    );
}
