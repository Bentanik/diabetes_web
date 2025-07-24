import React from "react";
import GroupDetailComponent from "../components";

type GroupDetailPageProps = {
    params: Promise<{
        conversationId: string;
    }>;
};

export default async function ConversationDetailPage({
    params,
}: GroupDetailPageProps) {
    const { conversationId } = await params;

    return (
        <div>
            <GroupDetailComponent conversationId={conversationId} />
        </div>
    );
}
