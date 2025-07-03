import React from "react"
import { motion } from "framer-motion"
import { EyeIcon, EditIcon, Trash2Icon, PlusIcon, UsersIcon } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { StaffMember, getStatusColor, getStatusText, getStatusIcon } from "@/utils/statusUtils"
import { ViewMode } from "@/hooks/useStaffFilter"

/**
 * Interface cho props của StaffList component
 */
interface StaffListProps {
    staff: StaffMember[]
    viewMode: ViewMode
    onView?: (staff: StaffMember) => void
    onEdit?: (staff: StaffMember) => void
    onDelete?: (staff: StaffMember) => void
    onAddNew?: () => void
    emptyStateTitle?: string
    emptyStateDescription?: string
    addButtonText?: string
    className?: string
}

/**
 * Component hiển thị thông tin nhân viên trong grid view
 */
const StaffGridCard: React.FC<{
    staff: StaffMember
    index: number
    onView?: (staff: StaffMember) => void
    onEdit?: (staff: StaffMember) => void
    onDelete?: (staff: StaffMember) => void
}> = ({ staff, index, onView, onEdit, onDelete }) => {
    return (
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 group"
        >
            {/* Header của card */}
            <div className="flex items-center gap-4 mb-4">
                <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold">
                        {staff.avatar}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 truncate">{staff.name}</h3>
                    <p className="text-sm text-gray-500 truncate">{staff.role}</p>
                </div>
            </div>

            {/* Thông tin chi tiết */}
            <div className="space-y-3 mb-4">
                <div>
                    <p className="text-sm font-medium text-gray-600">Khoa</p>
                    <p className="text-sm text-gray-800">{staff.department}</p>
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-600">Địa điểm</p>
                    <p className="text-sm text-gray-800">{staff.location}</p>
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-600">Email</p>
                    <p className="text-sm text-gray-800 truncate">{staff.email}</p>
                </div>
            </div>

            {/* Status Badge */}
            <div className="mb-4">
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(staff.status)}`}>
                    {React.createElement(getStatusIcon(staff.status), { className: "w-3 h-3" })}
                    {getStatusText(staff.status)}
                </span>
            </div>

            {/* Thống kê (nếu có) */}
            {(staff.patientsCount !== undefined || staff.messagesCount !== undefined || staff.rating !== undefined) && (
                <div className="flex gap-4 text-sm text-gray-600 mb-4">
                    {staff.patientsCount !== undefined && <span>{staff.patientsCount} BN</span>}
                    {staff.messagesCount !== undefined && <span>{staff.messagesCount} TN</span>}
                    {staff.rating !== undefined && <span>⭐ {staff.rating}</span>}
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {onView && (
                    <Button variant="ghost" size="sm" onClick={() => onView(staff)}>
                        <EyeIcon className="w-4 h-4" />
                    </Button>
                )}
                {onEdit && (
                    <Button variant="ghost" size="sm" onClick={() => onEdit(staff)}>
                        <EditIcon className="w-4 h-4" />
                    </Button>
                )}
                {onDelete && (
                    <Button variant="ghost" size="sm" onClick={() => onDelete(staff)}>
                        <Trash2Icon className="w-4 h-4" />
                    </Button>
                )}
            </div>
        </motion.div>
    )
}

/**
 * Component hiển thị table row trong list view
 */
const StaffTableRow: React.FC<{
    staff: StaffMember
    index: number
    onView?: (staff: StaffMember) => void
    onEdit?: (staff: StaffMember) => void
    onDelete?: (staff: StaffMember) => void
}> = ({ staff, index, onView, onEdit, onDelete }) => {
    return (
        <motion.tr
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.05 }}
            className="border-b border-gray-100 hover:bg-gray-50"
        >
            {/* Tên và vai trò */}
            <td className="py-4 px-6">
                <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-green-500 text-white">
                            {staff.avatar}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold text-gray-800">{staff.name}</p>
                        <p className="text-sm text-gray-500">{staff.role}</p>
                    </div>
                </div>
            </td>

            {/* Khoa và địa điểm */}
            <td className="py-4 px-6">
                <div>
                    <p className="font-medium text-gray-800">{staff.department}</p>
                    <p className="text-sm text-gray-500">{staff.location}</p>
                </div>
            </td>

            {/* Thông tin liên hệ */}
            <td className="py-4 px-6">
                <div className="space-y-1">
                    <p className="text-sm text-gray-600">{staff.email}</p>
                    <p className="text-sm text-gray-600">{staff.phone}</p>
                </div>
            </td>

            {/* Trạng thái */}
            <td className="py-4 px-6">
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(staff.status)}`}>
                    {React.createElement(getStatusIcon(staff.status), { className: "w-3 h-3" })}
                    {getStatusText(staff.status)}
                </span>
            </td>

            {/* Thống kê */}
            <td className="py-4 px-6">
                <div className="flex gap-4 text-sm">
                    {staff.patientsCount !== undefined && <span className="text-gray-600">{staff.patientsCount} BN</span>}
                    {staff.messagesCount !== undefined && <span className="text-gray-600">{staff.messagesCount} TN</span>}
                    {staff.rating !== undefined && <span className="text-gray-600">⭐ {staff.rating}</span>}
                </div>
            </td>

            {/* Actions */}
            <td className="py-4 px-6">
                <div className="flex gap-2">
                    {onView && (
                        <Button variant="ghost" size="sm" onClick={() => onView(staff)}>
                            <EyeIcon className="w-4 h-4" />
                        </Button>
                    )}
                    {onEdit && (
                        <Button variant="ghost" size="sm" onClick={() => onEdit(staff)}>
                            <EditIcon className="w-4 h-4" />
                        </Button>
                    )}
                    {onDelete && (
                        <Button variant="ghost" size="sm" onClick={() => onDelete(staff)}>
                            <Trash2Icon className="w-4 h-4" />
                        </Button>
                    )}
                </div>
            </td>
        </motion.tr>
    )
}

/**
 * Component Empty State hiển thị khi không có dữ liệu
 */
const EmptyState: React.FC<{
    title: string
    description: string
    onAddNew?: () => void
    addButtonText: string
}> = ({ title, description, onAddNew, addButtonText }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl p-12 shadow-lg border border-gray-200 text-center"
        >
            <UsersIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
            <p className="text-gray-500 mb-6">{description}</p>
            {onAddNew && (
                <Button className="gap-2" onClick={onAddNew}>
                    <PlusIcon className="w-4 h-4" />
                    {addButtonText}
                </Button>
            )}
        </motion.div>
    )
}

/**
 * Component chính hiển thị danh sách nhân viên
 * Có thể chuyển đổi giữa grid view và list view
 */
export const StaffList: React.FC<StaffListProps> = ({
    staff,
    viewMode,
    onView,
    onEdit,
    onDelete,
    onAddNew,
    emptyStateTitle = "Không tìm thấy nhân viên",
    emptyStateDescription = "Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm",
    addButtonText = "Thêm nhân viên mới",
    className = ""
}) => {
    // Hiển thị empty state nếu không có dữ liệu
    if (staff.length === 0) {
        return (
            <div className={className}>
                <EmptyState
                    title={emptyStateTitle}
                    description={emptyStateDescription}
                    onAddNew={onAddNew}
                    addButtonText={addButtonText}
                />
            </div>
        )
    }

    // Grid View
    if (viewMode === "grid") {
        return (
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
                {staff.map((member, index) => (
                    <StaffGridCard
                        key={member.id}
                        staff={member}
                        index={index}
                        onView={onView}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                ))}
            </div>
        )
    }

    // List View
    return (
        <div className={className}>
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
            >
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Nhân viên
                                </th>
                                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Khoa/Địa điểm
                                </th>
                                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Liên hệ
                                </th>
                                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Trạng thái
                                </th>
                                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Thống kê
                                </th>
                                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Hành động
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {staff.map((member, index) => (
                                <StaffTableRow
                                    key={member.id}
                                    staff={member}
                                    index={index}
                                    onView={onView}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    )
} 