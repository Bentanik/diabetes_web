'use client'

import DocumentChunkList from '@/app/admin/train-ai/document-detail/[id]/components/document_chunk_list'
import Header from '@/app/admin/train-ai/document-detail/[id]/components/header'
import { useGetDocumentByIdService } from '@/services/train-ai/services'
import React from 'react'

interface DocumentDetailComponentProps {
    id: string
}

export default function DocumentDetailComponent({ id }: DocumentDetailComponentProps) {
    const { data: documentData } = useGetDocumentByIdService(id)

    return (
        <div>
            <header>
                {documentData && <Header documentData={documentData} />}
            </header>
            <main className='mt-6'>
                <DocumentChunkList id={id} />
            </main>
        </div>
    )
}