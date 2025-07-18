// "use client";

// import { useEffect, useState, useCallback } from "react";
// import { SearchIcon, Plus, X, User } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
// import {
//     Dialog,
//     DialogContent,
//     DialogDescription,
//     DialogHeader,
//     DialogTitle,
//     DialogTrigger,
// } from "@/components/ui/dialog";
// import useGetUserAvailable from "../hooks/use-get-user-available";
// import {
//     Table,
//     TableBody,
//     TableCell,
//     TableHead,
//     TableHeader,
//     TableRow,
// } from "@/components/ui/table";
// import InfiniteScroll from "@/components/scroll-paginated";
// import useServiceAddStaff from "@/app/hospital/conversation/conversation-detail/hooks/use-add-staff";

// export default function GroupStaffDialog({
//     conversationId,
// }: REQUEST.ConversationId) {
//     const [searchTerm, setSearchTerm] = useState<string>("");
//     const [selectSortType, setSelectSortType] = useState<string>("");
//     const { getUserAvailableApi } = useGetUserAvailable();
//     const [isSortDesc, setIsSortDesc] = useState<boolean>(true);
//     const [data, setData] = useState<API.UserAvailable[]>([]);
//     const [currentPage, setCurrentPage] = useState<number>(1);
//     const [isOpenDialog, setIsDialogOpen] = useState<boolean>(false);
//     const [isLoading, setIsLoading] = useState<boolean>(false);
//     const [hasMore, setHasMore] = useState<boolean>(true);
//     const { form, onSubmit } = useServiceAddStaff({ conversationId });
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [selectedId, setSelectedId] = useState<string>("");

//     const pageSize = 10;

//     const handleGetData = async (
//         pageIndex: number,
//         isLoadMore: boolean = false
//     ) => {
//         if (isLoading) {
//             return;
//         }
//         setIsLoading(true);
//         try {
//             const res = await getUserAvailableApi({
//                 conversationId: conversationId,
//                 search: searchTerm,
//                 role: "HospitalStaff",
//                 pageIndex: pageIndex,
//                 pageSize: pageSize,
//                 sortType: selectSortType,
//                 isSortDesc: isSortDesc,
//             });
//             const newItems = res?.data?.items || [];

//             if (isLoadMore) {
//                 setData((prev) => {
//                     const uniqueItems = newItems.filter(
//                         (newItem: any) =>
//                             !prev.some(
//                                 (existingItem) => existingItem.id === newItem.id
//                             )
//                     );
//                     return [...prev, ...uniqueItems];
//                 });
//             } else {
//                 setData(newItems);
//             }
//             setHasMore(newItems.length === pageSize);
//         } catch (err) {
//             if (!isLoadMore) {
//                 setData([]);
//             }
//             setHasMore(false);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const handleLoadMore = useCallback(() => {
//         if (isLoading || !hasMore) {
//             return;
//         }
//         setCurrentPage((prevPage) => {
//             const nextPage = prevPage + 1;
//             console.log("Setting nextPage:", nextPage);
//             handleGetData(nextPage, true);
//             return nextPage;
//         });
//     }, [isLoading, hasMore, searchTerm, selectSortType, isSortDesc]);

//     const handleSearchOrSortChange = useCallback(() => {
//         setData([]);
//         setCurrentPage(1);
//         setHasMore(true);
//         handleGetData(1, false);
//     }, [searchTerm, selectSortType, isSortDesc]);

//     const handleFormSubmit = async () => {
//         if (!onSubmit || typeof onSubmit !== "function") {
//             console.error("onSubmit is not a function");
//             return;
//         }

//         setIsSubmitting(true);
//         try {
//             const formData: REQUEST.AddStaff = {
//                 adminId: selectedId,
//             };
//             await onSubmit(formData);
//         } catch (error) {
//             console.error("Error updating post:", error);
//             alert("Có lỗi xảy ra khi cập nhật bài viết.");
//         } finally {
//             setIsSubmitting(false);
//             handleGetData(1);
//         }
//     };

//     const filteredUsers = data.filter((user) =>
//         user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     const formatDate = (dateString: string) => {
//         return new Date(dateString).toLocaleDateString("vi-VN");
//     };

//     const selectUser = (id: string) => {
//         setSelectedId(id);
//         console.log("Selected user ID:", id);
//     };

//     useEffect(() => {
//         if (isOpenDialog) {
//             handleSearchOrSortChange();
//         }
//     }, [
//         searchTerm,
//         selectSortType,
//         isSortDesc,
//         isOpenDialog,
//         handleSearchOrSortChange,
//     ]);

//     useEffect(() => {
//         if (isOpenDialog) {
//             setData([]);
//             setCurrentPage(1);
//             setHasMore(true);
//             setSelectedId("");
//         }
//     }, [isOpenDialog]);

//     const selectedUser = data.find((u) => u.id === selectedId);

//     return (
//         <Dialog open={isOpenDialog} onOpenChange={setIsDialogOpen}>
//             <DialogTrigger asChild>
//                 <Button
//                     size="sm"
//                     className="px-6 py-5 bg-[#248FCA] hover:bg-[#2490cada] cursor-pointer"
//                 >
//                     <Plus width={20} height={20} color="white" />
//                     Thêm nhân viên
//                 </Button>
//             </DialogTrigger>
//             <DialogContent className="sm:max-w-[800px] h-[700px] flex flex-col">
//                 <DialogHeader className="flex-shrink-0">
//                     <DialogTitle className="text-[1.5rem] text-[#248FCA]">
//                         Thêm nhân viên vào nhóm
//                     </DialogTitle>
//                     <DialogDescription>
//                         Hãy tìm kiếm và chọn một nhân viên để thêm vào nhóm chat
//                     </DialogDescription>
//                 </DialogHeader>

//                 <div className="flex flex-col gap-4 flex-1 min-h-0">
//                     <div className="flex gap-5 flex-shrink-0">
//                         <div className="relative flex-1">
//                             <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                             <Input
//                                 placeholder="Tìm kiếm theo tên, số điện thoại..."
//                                 value={searchTerm}
//                                 onChange={(e) => setSearchTerm(e.target.value)}
//                                 className="pl-10"
//                             />
//                         </div>
//                         <Button
//                             type="submit"
//                             className="bg-[#248fca] hover:bg-[#2490cacb] cursor-pointer"
//                             disabled={!selectedId || isSubmitting}
//                             onClick={handleFormSubmit}
//                         >
//                             Thêm vào nhóm
//                         </Button>
//                     </div>

//                     {selectedUser && (
//                         <div className="flex items-center gap-2 flex-wrap">
//                             <div className="flex items-center bg-blue-100 text-blue-700 px-3 py-2 rounded-full text-sm">
//                                 <Avatar className="h-6 w-6 mr-2">
//                                     <AvatarImage src={selectedUser.avatar} />
//                                     <AvatarFallback>
//                                         {selectedUser.fullName.charAt(0)}
//                                     </AvatarFallback>
//                                 </Avatar>
//                                 <span className="font-medium">
//                                     {selectedUser.fullName}
//                                 </span>
//                                 <X
//                                     className="ml-2 w-4 h-4 cursor-pointer hover:text-red-500"
//                                     onClick={() => setSelectedId("")}
//                                 />
//                             </div>
//                         </div>
//                     )}

//                     {filteredUsers.length === 0 && !isLoading ? (
//                         <div className="flex-1 flex items-center justify-center">
//                             <div className="text-center">
//                                 <div className="text-gray-400 mb-4">
//                                     <User className="h-12 w-12 mx-auto" />
//                                 </div>
//                                 <h3 className="text-lg font-medium text-gray-900 mb-2">
//                                     Không tìm thấy thành viên
//                                 </h3>
//                                 <p className="text-gray-500">
//                                     Thử điều chỉnh bộ lọc hoặc tìm kiếm với từ
//                                     khóa khác
//                                 </p>
//                             </div>
//                         </div>
//                     ) : (
//                         <div className="flex-1 overflow-y-auto border rounded-md">
//                             <InfiniteScroll
//                                 hasMore={hasMore}
//                                 isLoading={isLoading}
//                                 onLoadMore={handleLoadMore}
//                                 loadingText="Đang tải thêm nhân viên..."
//                                 endText="Đã tải hết tất cả nhân viên"
//                                 threshold={200}
//                             >
//                                 <Table>
//                                     <TableHeader className="sticky top-0 bg-white z-10">
//                                         <TableRow className="h-12">
//                                             <TableHead>Thành viên</TableHead>
//                                             <TableHead>Vai trò</TableHead>
//                                             <TableHead>Trạng thái</TableHead>
//                                             <TableHead>Chọn</TableHead>
//                                         </TableRow>
//                                     </TableHeader>
//                                     <TableBody>
//                                         {filteredUsers.map((user) => (
//                                             <TableRow
//                                                 key={user.id}
//                                                 className={`h-16 hover:bg-gray-50 cursor-pointer ${
//                                                     selectedId === user.id
//                                                         ? "bg-blue-50"
//                                                         : ""
//                                                 }`}
//                                                 onClick={() => {
//                                                     if (user.status !== 1) {
//                                                         selectUser(user.id);
//                                                     }
//                                                 }}
//                                             >
//                                                 <TableCell className="py-2">
//                                                     <div className="flex items-center space-x-3">
//                                                         <div className="relative">
//                                                             <Avatar className="h-10 w-10">
//                                                                 <AvatarImage
//                                                                     src={
//                                                                         user.avatar
//                                                                     }
//                                                                 />
//                                                                 <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold text-sm">
//                                                                     {user.fullName.charAt(
//                                                                         0
//                                                                     )}
//                                                                 </AvatarFallback>
//                                                             </Avatar>
//                                                             <div
//                                                                 className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
//                                                                     user.status ===
//                                                                     0
//                                                                         ? "bg-green-500"
//                                                                         : "bg-gray-400"
//                                                                 }`}
//                                                             />
//                                                         </div>
//                                                         <div>
//                                                             <div className="font-medium text-gray-900">
//                                                                 {user.fullName}
//                                                             </div>
//                                                             <div className="text-sm text-gray-500">
//                                                                 ID: {user.id}
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 </TableCell>
//                                                 <TableCell className="py-2">
//                                                     <div className="flex items-center gap-2">
//                                                         <User className="h-4 w-4" />
//                                                         <span>Bệnh nhân</span>
//                                                     </div>
//                                                 </TableCell>
//                                                 <TableCell className="py-2">
//                                                     <span
//                                                         className={`px-2 py-1 rounded-full text-xs ${
//                                                             user.status === 1
//                                                                 ? "bg-green-100 text-green-700"
//                                                                 : "bg-gray-100 text-gray-700"
//                                                         }`}
//                                                     >
//                                                         {user.status === 1
//                                                             ? "Đã vào nhóm"
//                                                             : "Chưa vào nhóm"}
//                                                     </span>
//                                                 </TableCell>
//                                                 <TableCell>
//                                                     <input
//                                                         type="radio"
//                                                         name="selectedUser"
//                                                         disabled
//                                                         checked={
//                                                             selectedId ===
//                                                             user.id
//                                                         }
//                                                         onChange={() =>
//                                                             selectUser(user.id)
//                                                         }
//                                                         className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
//                                                     />
//                                                 </TableCell>
//                                             </TableRow>
//                                         ))}
//                                     </TableBody>
//                                 </Table>
//                             </InfiniteScroll>
//                         </div>
//                     )}
//                 </div>
//             </DialogContent>
//         </Dialog>
//     );
// }
