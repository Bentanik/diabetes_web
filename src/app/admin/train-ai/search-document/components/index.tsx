'use client'

import SearchInput from '@/app/admin/train-ai/search-document/components/search_input'
import Header from '@/app/admin/train-ai/search-document/components/header'
import DocumentList from '@/app/admin/train-ai/search-document/components/document_list'
import React, { useState } from 'react'
import { useDebounce } from '@/hooks/use-debounce'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, Search } from 'lucide-react'

import { useGetRetrievedContextService } from '@/services/train-ai/services'

export default function SearchDocumentComponent() {
    const [searchValue, setSearchValue] = useState('')
    const debouncedSearchValue = useDebounce(searchValue, 500)

    const { data: retrievedContext, isLoading: isRetrievedContextLoading } =
        useGetRetrievedContextService(debouncedSearchValue)

    const hasSearched = !!debouncedSearchValue.trim() && !isRetrievedContextLoading

    return (
        <div className="min-h-screen bg-gray-50">
            <header>
                <Header />
            </header>
            <main className="mx-auto py-6">
                <div className="mx-auto">
                    <SearchInput
                        value={searchValue}
                        handleSearch={setSearchValue}
                        placeholder="Nhập nội dung bạn muốn tìm kiếm..."
                        className="mb-6"
                    />

                    <AnimatePresence>
                        {isRetrievedContextLoading && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="flex items-center justify-center py-12"
                            >
                                <div className="flex items-center space-x-3 text-[#248fca]">
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                    <span className="text-lg font-medium">Đang tìm kiếm tài liệu...</span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {!isRetrievedContextLoading && hasSearched && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-6"
                            >
                                <DocumentList
                                    documents={retrievedContext || []}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {!isRetrievedContextLoading && !hasSearched && !searchValue && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                            <div className="max-w-md mx-auto">
                                <Search className="w-20 h-20 mx-auto mb-6 text-gray-300" />
                                <h3 className="text-2xl font-semibold text-gray-700 mb-3">Tìm kiếm tài liệu</h3>
                                <p className="text-gray-500 mb-6">
                                    Nhập nội dung bạn muốn tìm kiếm
                                </p>
                                <div className="flex flex-wrap justify-center gap-2 text-sm">
                                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full">Tái tháo đường là gì?</span>
                                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full">Có mấy loại tái tháo đường?</span>
                                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full">Tái tháo đường có nguy hiểm không?</span>
                                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full">Tái tháo đường có thể điều trị được không?</span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </main>
        </div>
    )
}