import React from "react";
import GroupDetailComponent from "../components";

type GroupDetailPageProps = {
    params: Promise<{
        groupId: string;
    }>;
};

export default async function GroupDetailPage({
    params,
}: GroupDetailPageProps) {
    const { groupId } = await params;

    return (
        <div>
            <GroupDetailComponent groupId={groupId} />
        </div>
    );
}
