/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import { Search, Filter, FileText, Image, MessageCircle, Eye, Bookmark, ChevronLeft, ChevronRight } from 'lucide-react';

interface HighlightData {
    id: string;
    content: {
        text?: string;
        image?: string;
    };
    position: {
        boundingRect: {
            x1: number;
            y1: number;
            x2: number;
            y2: number;
            width: number;
            height: number;
            pageNumber?: number;
        };
        rects: Array<{
            x1: number;
            y1: number;
            x2: number;
            y2: number;
            width: number;
            height: number;
            pageNumber?: number;
        }>;
        pageNumber: number;
    };
    comment: {
        text: string;
        emoji: string;
    };
    selected?: boolean;
}

interface DocumentChunksProps {
    highlights: HighlightData[];
    onHighlightClick: (highlightId: string) => void;
    onSelectionToggle: (highlightId: string) => void;
}

const ITEMS_PER_PAGE = 5; // Number of highlights per page

const DocumentChunks: React.FC<DocumentChunksProps> = ({
    highlights,
    onHighlightClick,
    onSelectionToggle
}) => {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [showOnlySelected, setShowOnlySelected] = React.useState(false);
    const [currentPage, setCurrentPage] = React.useState(1);

    // Filter highlights based on search and show only selected
    const filteredHighlights = highlights.filter(highlight => {
        const matchesSearch = !searchTerm ||
            highlight.content.text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            highlight.comment.text.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter = !showOnlySelected || highlight.selected;

        return matchesSearch && matchesFilter;
    });

    // Pagination calculations
    const totalPages = Math.ceil(filteredHighlights.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedHighlights = filteredHighlights.slice(startIndex, endIndex);

    // Reset to first page when filters change
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, showOnlySelected]);

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        // Adjust startPage if we're near the end
        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return pages;
    };

    return (
        <div className="w-full h-full bg-white rounded-2xl border border-gray-200 flex flex-col overflow-hidden shadow-lg"
            style={{ boxShadow: "rgba(0, 0, 0, 0.08) 0px 4px 12px" }}>

            {/* Header with gradient */}
            <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-[#248fca] to-[#1e7bb8] relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                            <Bookmark className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white">Đoạn nội dung</h3>
                            <p className="text-white/80 text-sm">Các đoạn được đánh dấu trong tài liệu</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-white/90 text-sm">
                            <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                <span>{highlights.length} đoạn</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                <div className="flex gap-3">
                    {/* Search Input */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm nội dung..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#248fca]/20 focus:border-[#248fca] outline-none transition-all text-sm"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                ×
                            </button>
                        )}
                    </div>

                    {/* Filter Toggle */}
                    <button
                        onClick={() => setShowOnlySelected(!showOnlySelected)}
                        className={`px-3 py-2 rounded-lg border transition-all text-sm font-medium flex items-center gap-2 ${showOnlySelected
                            ? 'bg-[#248fca] text-white border-[#248fca]'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-[#248fca]/30'
                            }`}
                    >
                        <Filter className="w-4 h-4" />
                        {showOnlySelected ? 'Đang xem' : 'Tất cả'}
                    </button>
                </div>

                {/* Results info and pagination info */}
                <div className="flex items-center justify-between mt-3">
                    <div className="text-xs text-gray-500 flex items-center gap-2">
                        <span>Hiển thị {filteredHighlights.length} trong tổng số {highlights.length} đoạn</span>
                        {searchTerm && (
                            <span className="px-2 py-1 bg-gray-200 rounded text-gray-700">&ldquo;{searchTerm}&rdquo;</span>
                        )}
                    </div>

                    {totalPages > 1 && (
                        <div className="text-xs text-gray-500">
                            Trang {currentPage} / {totalPages} ({ITEMS_PER_PAGE} đoạn/trang)
                        </div>
                    )}
                </div>
            </div>

            {/* Highlights List */}
            <div className="flex-1 overflow-y-auto">
                {filteredHighlights.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <Search className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-700 mb-2">Không tìm thấy đoạn nào</h3>
                        <p className="text-sm text-center max-w-xs">
                            {searchTerm ? `Không có đoạn nào khớp với &ldquo;${searchTerm}&rdquo;` :
                                showOnlySelected ? 'Chưa có đoạn nào được chọn' :
                                    'Không có đoạn nội dung nào'}
                        </p>
                        {(searchTerm || showOnlySelected) && (
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setShowOnlySelected(false);
                                }}
                                className="mt-4 text-[#248fca] hover:text-[#1e7bb8] text-sm font-medium"
                            >
                                Xóa bộ lọc
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="p-4 space-y-3">
                        {paginatedHighlights.map((highlight, index) => (
                            <div
                                key={highlight.id}
                                className={`group relative p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer hover:shadow-lg transform hover:-translate-y-1 ${highlight.selected
                                    ? 'border-[#248fca] bg-gradient-to-r from-[#248fca]/5 to-[#248fca]/10 shadow-md'
                                    : 'border-gray-200 hover:border-[#248fca]/40 bg-white hover:bg-gray-50/50'
                                    }`}
                                onClick={() => onHighlightClick(highlight.id)}
                                style={{
                                    animationDelay: `${index * 50}ms`
                                }}
                            >
                                {/* Selection indicator */}
                                {highlight.selected && (
                                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#248fca] to-[#1e7bb8] rounded-l-xl"></div>
                                )}

                                {/* Header */}
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-[#248fca]/10 text-[#248fca] rounded-full border border-[#248fca]/20">
                                            <FileText className="w-3 h-3 mr-1" />
                                            Trang {highlight.position.pageNumber}
                                        </span>
                                        <span className="text-xs text-gray-500">#{startIndex + index + 1}</span>
                                    </div>

                                    {/* Checkbox with animation */}
                                    <label
                                        className="relative cursor-pointer group/checkbox"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={highlight.selected}
                                            onChange={() => onSelectionToggle(highlight.id)}
                                            className="sr-only"
                                        />
                                        <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-200 group-hover/checkbox:scale-110 ${highlight.selected
                                            ? 'bg-[#248fca] border-[#248fca] shadow-lg'
                                            : 'border-gray-300 hover:border-[#248fca] bg-white'
                                            }`}>
                                            {highlight.selected && (
                                                <svg className="w-4 h-4 text-white animate-in zoom-in duration-200" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </div>
                                    </label>
                                </div>

                                {/* Content */}
                                {highlight.content.text && (
                                    <div className="mb-3">
                                        <p className="text-sm text-gray-700 leading-relaxed line-clamp-4 group-hover:text-gray-900 transition-colors">
                                            {highlight.content.text.length > 150
                                                ? `${highlight.content.text.substring(0, 150)}...`
                                                : highlight.content.text
                                            }
                                        </p>
                                        <div className="mt-2 text-xs text-gray-500">
                                            {highlight.content.text.length} ký tự
                                        </div>
                                    </div>
                                )}

                                {highlight.content.image && (
                                    <div className="text-sm text-gray-500 italic mb-3 flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                        <Image className="w-5 h-5 text-[#248fca]" />
                                        <span>Hình ảnh được đánh dấu</span>
                                        <span className="ml-auto text-xs bg-[#248fca]/10 text-[#248fca] px-2 py-1 rounded-full">Hình ảnh</span>
                                    </div>
                                )}

                                {/* Comment */}
                                {highlight.comment.text && (
                                    <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                        <MessageCircle className="w-4 h-4 text-[#248fca] flex-shrink-0" />
                                        <div className="flex items-center gap-2 text-sm">
                                            <span className="text-lg">{highlight.comment.emoji}</span>
                                            <span className="text-[#248fca] font-medium">{highlight.comment.text}</span>
                                        </div>
                                    </div>
                                )}

                                {/* Hover actions */}
                                <div className="absolute top-4 right-16 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <div className="flex gap-1">
                                        <button className="p-1 bg-white shadow-md rounded border text-gray-600 hover:text-[#248fca] transition-colors">
                                            <Eye className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                            Đoạn {startIndex + 1}-{Math.min(endIndex, filteredHighlights.length)} của {filteredHighlights.length}
                        </div>

                        <div className="flex items-center gap-2">
                            {/* Previous button */}
                            <button
                                onClick={() => goToPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="p-2 rounded-lg border border-gray-200 hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>

                            {/* Page numbers */}
                            <div className="flex items-center gap-1">
                                {getPageNumbers().map(page => (
                                    <button
                                        key={page}
                                        onClick={() => goToPage(page)}
                                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${page === currentPage
                                            ? 'bg-[#248fca] text-white'
                                            : 'border border-gray-200 hover:bg-white text-gray-600'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>

                            {/* Next button */}
                            <button
                                onClick={() => goToPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-lg border border-gray-200 hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DocumentChunks; 