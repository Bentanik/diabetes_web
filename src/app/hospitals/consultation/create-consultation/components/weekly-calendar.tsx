"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import type {
    DateSelectArg,
    EventClickArg,
    EventDropArg,
    EventInput,
} from "@fullcalendar/core";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import useToast from "@/hooks/use-toast";
import { Save, MousePointer2, Trash2, SquarePen } from "lucide-react";
import { createRoot } from "react-dom/client";

export interface TimeSlot {
    start: string;
    end: string;
    id?: string;
    status?: number;
    clientKey?: string;
}

interface DaySchedule {
    date: string;
    times: TimeSlot[];
}

interface WeeklyCalendarProps {
    selectedWeekData: { label: string; dates: string[] };
    scheduleData: { timeTemplates: DaySchedule[] };
    setScheduleData: (data: { timeTemplates: DaySchedule[] }) => void;
    isLoading?: boolean;
    onChangedSlotsUpdate: (changed: any[]) => void;
    onDeletedIdsUpdate: (ids: string[]) => void;
    onStatusChange?: (status: number) => void;
    resetSignal: number;
}

// Các hàm hỗ trợ

// Đánh dấu một slot để tracking thay đổi
const slotIdentity = (slot: TimeSlot) =>
    slot.id ? `id:${slot.id}` : `draft:${slot.clientKey}`;

// Chuyển "HH:MM" thành "HH:MM:SS"
const ensureHms = (time: string) =>
    time.split(":").length === 2 ? `${time}:00` : time;
// Chuyển ngày và giờ thành định dạng ISO
const toIso = (date: string, time: string) => `${date}T${ensureHms(time)}`;
//
const cloneSchedule = (src: {
    timeTemplates: DaySchedule[];
}): { timeTemplates: DaySchedule[] } => ({
    timeTemplates: src.timeTemplates.map((d) => ({
        date: d.date,
        times: d.times.map((t) => ({ ...t })),
    })),
});

// Chuyển "HH:MM:SS" thành số phút từ đầu ngày
const toMinutes = (t: string) => {
    const [hh, mm] = ensureHms(t)
        .split(":")
        .map((v) => parseInt(v, 10));
    return hh * 60 + mm;
};

// Lấy ngày hiện tại dạng "YYYY-MM-DD"
const getTodayStr = () => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
};

// Lấy giờ hiện tại dạng "HH:MM:SS"
const getNowHms = () => {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    const ss = String(now.getSeconds()).padStart(2, "0");
    return `${hh}:${mm}:${ss}`;
};

// const isPastDateTime = (date: string, endTime: string) => {
//     const today = getTodayStr();
//     if (date < today) return true;
//     if (date > today) return false;
//     return ensureHms(endTime) <= getNowHms();
// };

// Kiểm tra nếu thời điểm bắt đầu đã qua
const isPastByStart = (date: string, startTime: string) => {
    const today = getTodayStr();
    if (date < today) return true;
    if (date > today) return false;
    return ensureHms(startTime) <= getNowHms();
};

// Kiểm tra chồng lấn trong cùng một ngày
const hasOverlap = (
    times: TimeSlot[],
    start: string,
    end: string,
    ignoreIndex?: number
) => {
    const s = toMinutes(start);
    const e = toMinutes(end);
    for (let i = 0; i < times.length; i++) {
        if (ignoreIndex === i) continue;
        const ts = toMinutes(times[i].start);
        const te = toMinutes(times[i].end);
        if (s < te && e > ts) return true;
    }
    return false;
};

// Component chính
export default function WeeklyCalendar({
    selectedWeekData,
    scheduleData,
    setScheduleData,
    isLoading = false,
    onChangedSlotsUpdate,
    onDeletedIdsUpdate,
    onStatusChange,
    resetSignal,
}: WeeklyCalendarProps) {
    const { addToast } = useToast();
    const [dialogOpen, setDialogOpen] = useState(false);
    const calendarRef = useRef<any>(null);
    const [editTarget, setEditTarget] = useState<{
        dayIndex: number;
        slotIndex: number;
        mode: "edit" | "create";
    } | null>(null);
    const [editStart, setEditStart] = useState("");
    const [editEnd, setEditEnd] = useState("");
    const changedKeysRef = useRef<Set<string>>(new Set());
    const deletedIdsRef = useRef<string[]>([]);
    // New: selection and mark-for-deletion state + bulk status
    const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
    const [markedForDeletion, setMarkedForDeletion] = useState<Set<string>>(
        new Set()
    );
    const [bulkStatus, setBulkStatus] = useState<string>("");

    // Lấy slot hiện tại đang chỉnh sửa (nếu có)
    const currentSlot = useMemo(() => {
        if (!editTarget) return null;
        const date = selectedWeekData.dates[editTarget.dayIndex];
        const day = scheduleData.timeTemplates.find((d) => d.date === date);
        return day?.times[editTarget.slotIndex] ?? null;
    }, [editTarget, selectedWeekData.dates, scheduleData.timeTemplates]);

    // Xác định nếu thời gian có thể chỉnh sửa
    const canEditTime = useMemo(() => {
        if (!editTarget) return false;
        if (editTarget.mode === "create") return true; // always editable when creating
        if (!currentSlot) return false;
        if (currentSlot.status === 2) return false; // booked
        // editable if draft (no id) or status=1
        return !currentSlot.id || currentSlot.status === 1;
    }, [editTarget, currentSlot]);

    // Đồng bộ tuần hiển thị khi tuần được chọn thay đổi
    useEffect(() => {
        if (selectedWeekData?.dates?.length) {
            const startDate = selectedWeekData.dates[0];
            const api = calendarRef.current?.getApi?.();
            if (api) {
                api.gotoDate(startDate);
            }
        }
    }, [selectedWeekData?.dates?.[0]]);

    // Reset trạng thái khi nhận tín hiệu reset
    useEffect(() => {
        // reset tracking after submit
        changedKeysRef.current = new Set();
        deletedIdsRef.current = [];
        onChangedSlotsUpdate([]);
        onDeletedIdsUpdate([]);
        setSelectedKeys(new Set());
        setBulkStatus("");
    }, [resetSignal]);

    // Áp dụng thay đổi hàng loạt khi trạng thái hàng loạt thay đổi
    useEffect(() => {
        if (bulkStatus !== "" && selectedKeys.size > 0) {
            const next = cloneSchedule(scheduleData);
            Array.from(selectedKeys).forEach((keyStr) => {
                const [d, s] = keyStr.split("-").map(Number);
                const date = selectedWeekData.dates[d];
                const day = next.timeTemplates.find((t) => t.date === date);
                const slot = day?.times[s];
                if (slot) {
                    changedKeysRef.current.add(slotIdentity(slot));
                }
            });
            setTimeout(() => {
                upsertChanged(next);
                onStatusChange?.(Number(bulkStatus));
            }, 0);
        }
    }, [bulkStatus]);

    // Chuẩn bị sự kiện cho FullCalendar
    const events: EventInput[] = useMemo(() => {
        const evts: EventInput[] = [];
        selectedWeekData.dates.forEach((date, dayIndex) => {
            const day = scheduleData.timeTemplates.find((d) => d.date === date);
            day?.times.forEach((slot, slotIndex) => {
                const status = slot.status ?? 1;
                const key = `${dayIndex}-${slotIndex}`;
                const isDraft = !slot.id;
                // Thêm sự kiện vào mảng
                evts.push({
                    id: slot.id || key,
                    title: isDraft
                        ? "Nháp"
                        : status === 2
                        ? "Đã đặt"
                        : status === 1
                        ? "Không công khai"
                        : "Công khai",
                    start: toIso(date, slot.start),
                    end: toIso(date, slot.end),
                    editable:
                        (isDraft || status === 1) &&
                        !isPastByStart(date, slot.start),
                    backgroundColor: isDraft
                        ? "#248FCA"
                        : status === 2
                        ? "#6b7280"
                        : status === 1
                        ? "#f59e0b"
                        : "#059669",
                    borderColor: isDraft
                        ? "#248FCA"
                        : status === 2
                        ? "#6b7280"
                        : status === 1
                        ? "#f59e0b"
                        : "#059669",
                    extendedProps: {
                        dayIndex,
                        slotIndex,
                        templateId: slot.id ?? null,
                        status,
                        key,
                        clientKey: slot.clientKey,
                        identity: slotIdentity(slot),
                    },
                });
            });
        });
        return evts;
    }, [scheduleData.timeTemplates, selectedWeekData.dates]);

    //
    const backgroundEvents: EventInput[] = useMemo(() => {
        const today = getTodayStr();
        const nowHms = getNowHms();
        const bg: EventInput[] = [];
        selectedWeekData.dates.forEach((date) => {
            if (date < today) {
                bg.push({
                    start: `${date}T00:00:00`,
                    end: `${date}T23:59:59`,
                    display: "background",
                    backgroundColor: "#fee2e2",
                });
            } else if (date === today) {
                bg.push({
                    start: `${date}T00:00:00`,
                    end: `${date}T${nowHms}`,
                    display: "background",
                    backgroundColor: "#fee2e2",
                });
            }
        });
        return bg;
    }, [selectedWeekData.dates]);

    const upsertChanged = (source?: { timeTemplates: DaySchedule[] }) => {
        const base = source ?? scheduleData;
        const changedArray = Array.from(changedKeysRef.current)
            .map((identity) => {
                let found: { date: string; slot: TimeSlot } | null = null;
                for (const day of base.timeTemplates) {
                    for (const slot of day.times) {
                        const idStr = slotIdentity(slot);
                        if (idStr === identity) {
                            found = { date: day.date, slot };
                            break;
                        }
                    }
                    if (found) break;
                }
                if (!found) return null;
                const { date, slot } = found;
                return {
                    timeTemplateId: slot.id || null,
                    date,
                    timeRange: {
                        start: ensureHms(slot.start),
                        end: ensureHms(slot.end),
                    },
                };
            })
            .filter(Boolean);
        onChangedSlotsUpdate(changedArray);
        onDeletedIdsUpdate(deletedIdsRef.current);
    };

    const ensureDaySchedule = (date: string) => {
        const next = cloneSchedule(scheduleData);
        let day = next.timeTemplates.find((d) => d.date === date);
        if (!day) {
            day = { date, times: [] };
            next.timeTemplates.push(day);
        }
        return { next, day } as {
            next: { timeTemplates: DaySchedule[] };
            day: DaySchedule;
        };
    };

    const validateSlotAndToast = (
        day: DaySchedule,
        start: string,
        end: string,
        ignoreIndex?: number
    ) => {
        const s = toMinutes(start);
        const e = toMinutes(end);
        if (e - s < 15) {
            addToast({
                type: "error",
                description: "Khoảng thời gian tối thiểu là 15 phút",
                duration: 3000,
            });
            return false;
        }
        if (hasOverlap(day.times, start, end, ignoreIndex)) {
            addToast({
                type: "error",
                description: "Khung giờ bị chồng lấn trong cùng ngày",
                duration: 3000,
            });
            return false;
        }
        return true;
    };

    const handleDateSelect = (arg: DateSelectArg) => {
        const date = arg.startStr.split("T")[0];
        const start = new Date(arg.start);
        const end = new Date(start.getTime() + 15 * 60 * 1000);
        setEditStart(start.toTimeString().slice(0, 5));
        setEditEnd(end.toTimeString().slice(0, 5));
        const dayIndex = selectedWeekData.dates.findIndex((d) => d === date);
        setEditTarget({ dayIndex, slotIndex: -1, mode: "create" });
        setDialogOpen(true);
    };

    const handleEventClick = (arg: EventClickArg) => {
        const { dayIndex, slotIndex, status } = arg.event.extendedProps as any;
        const eventDate = arg.event.startStr.split("T")[0];
        const startHms =
            arg.event.startStr.split("T")[1]?.slice(0, 8) ?? "00:00:00";
        if (isPastByStart(eventDate, startHms)) {
            addToast({
                type: "error",
                description: "Thời gian đã qua, không thể chỉnh sửa.",
                duration: 3000,
            });
            return;
        }
        if (status === 2) return; // status=2 do nothing
        const selectedDate = selectedWeekData.dates[dayIndex];
        const day = scheduleData.timeTemplates.find(
            (d) => d.date === selectedDate
        );
        const slot = day?.times[slotIndex];
        if (!slot) return;
        setEditStart(ensureHms(slot.start).slice(0, 5));
        setEditEnd(ensureHms(slot.end).slice(0, 5));
        setEditTarget({ dayIndex, slotIndex, mode: "edit" });
        setDialogOpen(true);
    };

    const persistEdit = () => {
        if (!editTarget) return;
        const date = selectedWeekData.dates[editTarget.dayIndex];
        const { next, day } = ensureDaySchedule(date);
        const newStart = ensureHms(editStart);
        const newEnd = ensureHms(editEnd);
        if (editTarget.mode === "create") {
            // Disallow creating slots in the past by start time
            if (isPastByStart(date, newStart)) {
                addToast({
                    type: "error",
                    description: "Thời gian đã qua, không thể chỉnh sửa.",
                    duration: 3000,
                });
                return;
            }
            if (!validateSlotAndToast(day, newStart, newEnd)) return;
            const clientKey = `draft-${Date.now()}-${Math.random()
                .toString(36)
                .slice(2, 8)}`;
            day.times.push({
                start: newStart,
                end: newEnd,
                status: 1,
                clientKey,
            });
            changedKeysRef.current.add(`draft:${clientKey}`);
        } else {
            const slot = day.times[editTarget.slotIndex];
            if (slot) {
                // Disallow editing into the past by start time
                if (isPastByStart(date, newStart)) {
                    addToast({
                        type: "error",
                        description: "Thời gian đã qua, không thể chỉnh sửa.",
                        duration: 3000,
                    });
                    return;
                }
                if (
                    !validateSlotAndToast(
                        day,
                        newStart,
                        newEnd,
                        editTarget.slotIndex
                    )
                )
                    return;

                const originalStart = ensureHms(slot.start);
                const originalEnd = ensureHms(slot.end);

                const identity = slotIdentity(slot);

                // Apply edits
                slot.start = newStart;
                slot.end = newEnd;
                slot.status = slot.status ?? 1;

                // Mark as changed only if time actually changed
                if (originalStart !== newStart || originalEnd !== newEnd) {
                    changedKeysRef.current.add(identity);
                }
            }
        }
        setScheduleData(next);
        setDialogOpen(false);
        setTimeout(() => upsertChanged(next), 0);
        onStatusChange?.(1);
    };

    const deleteFromDialog = () => {
        if (!editTarget) return;
        const date = selectedWeekData.dates[editTarget.dayIndex];
        const next = cloneSchedule(scheduleData);
        const day = next.timeTemplates.find((d) => d.date === date);
        if (!day) return;
        const slot = day.times[editTarget.slotIndex];
        if (!slot) return;
        if (slot.id) {
            deletedIdsRef.current = [...deletedIdsRef.current, slot.id];
        }
        day.times = day.times.filter((_, idx) => idx !== editTarget.slotIndex);
        if (day.times.length === 0) {
            next.timeTemplates = next.timeTemplates.filter(
                (d) => d.date !== date
            );
        }
        setScheduleData(next);
        setDialogOpen(false);
        upsertChanged(next);
    };

    const handleEventDrop = (arg: EventDropArg) => {
        const { dayIndex, slotIndex, status, templateId, clientKey } = arg.event
            .extendedProps as any;
        if (!(status === 1 || !templateId)) return; // allow draft or status=1
        const newDate = arg.event.startStr.split("T")[0];
        const oldDateGuard = selectedWeekData.dates[dayIndex];
        // Restrict status=1 (Không công khai) to only move within the same day
        if (status === 1 && newDate !== oldDateGuard) {
            addToast({
                type: "error",
                description: "Chỉ được di chuyển trong cùng một ngày",
                duration: 3000,
            });
            (arg as any).revert?.();
            return;
        }
        const newStart =
            arg.event.startStr.split("T")[1]?.slice(0, 8) ?? "00:00:00";
        const newEnd = arg.event.endStr?.split("T")[1]?.slice(0, 8) ?? newStart;
        const next = cloneSchedule(scheduleData);
        const oldDate = selectedWeekData.dates[dayIndex];
        const oldDay = next.timeTemplates.find((d) => d.date === oldDate);
        if (!oldDay) return;
        const slot = oldDay.times[slotIndex];
        if (!slot) return;
        // remove from old
        oldDay.times.splice(slotIndex, 1);
        if (oldDay.times.length === 0) {
            next.timeTemplates = next.timeTemplates.filter(
                (d) => d.date !== oldDate
            );
        }
        // add to new date
        let newDay = next.timeTemplates.find((d) => d.date === newDate);
        if (!newDay) {
            newDay = { date: newDate, times: [] };
            next.timeTemplates.push(newDay);
        }
        if (!validateSlotAndToast(newDay, newStart, newEnd)) {
            (arg as any).revert?.();
            return;
        }
        const moved: TimeSlot = {
            ...slot,
            start: newStart,
            end: newEnd,
            status: slot.status ?? 1,
        };
        newDay.times.push(moved);
        setScheduleData(next);
        const identity = moved.id
            ? `id:${moved.id}`
            : `draft:${moved.clientKey}`;
        changedKeysRef.current.add(identity);
        upsertChanged(next);
        onStatusChange?.(1);
    };

    const handleEventResize = (arg: any) => {
        const { dayIndex, slotIndex, status, templateId } = arg.event
            .extendedProps as any;
        if (!(status === 1 || !templateId)) return; // allow draft or status=1
        const date = selectedWeekData.dates[dayIndex];
        const next = cloneSchedule(scheduleData);
        const day = next.timeTemplates.find((d) => d.date === date);
        if (!day) return;
        if (!day.times[slotIndex]) return;
        const slot = day.times[slotIndex];
        const newStart =
            arg.event.startStr.split("T")[1]?.slice(0, 8) ?? slot.start;
        const newEnd = arg.event.endStr?.split("T")[1]?.slice(0, 8) ?? slot.end;
        if (!validateSlotAndToast(day, newStart, newEnd, slotIndex)) {
            (arg as any).revert?.();
            return;
        }
        slot.start = newStart;
        slot.end = newEnd;
        slot.status = slot.status ?? 1;
        setScheduleData(next);
        changedKeysRef.current.add(slotIdentity(slot));
        upsertChanged(next);
        onStatusChange?.(1);
    };

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-lg text-[#248FCA]">
                    <span>Lịch tuần: {selectedWeekData.label}</span>
                    <div className="flex items-center gap-2">
                        {selectedKeys.size > 0 && (
                            <>
                                <Select
                                    value={bulkStatus}
                                    onValueChange={setBulkStatus}
                                >
                                    <SelectTrigger className="h-8 w-[180px] text-xs">
                                        <SelectValue placeholder="Chọn trạng thái" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="0">
                                            Công khai
                                        </SelectItem>
                                        <SelectItem value="1">
                                            Không công khai
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </>
                        )}
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="h-[600px]">
                <style jsx global>{`
                    .fc .fc-timegrid-slots tr {
                        height: 48px;
                    }
                    .fc .fc-timegrid-slot {
                        height: 48px;
                    }
                    .fc .fc-timegrid-event {
                        min-height: 36px;
                        border-radius: 8px;
                    }
                    .fc .fc-timegrid-event.selected {
                        background-color: #258fca !important;
                        border-color: #258fca !important;
                    }
                    .fc .fc-timegrid-event.to-delete {
                        background-color: #dc2626 !important;
                        border-color: #dc2626 !important;
                    }
                `}</style>
                <FullCalendar
                    ref={calendarRef}
                    plugins={[timeGridPlugin, interactionPlugin]}
                    initialView="timeGridWeek"
                    initialDate={selectedWeekData.dates[0]}
                    firstDay={1}
                    height="100%"
                    slotDuration="00:15:00"
                    slotLabelInterval="01:00"
                    editable
                    selectable
                    scrollTime="08:00:00"
                    allDaySlot={false}
                    headerToolbar={false as any}
                    weekends={true}
                    events={[...events, ...backgroundEvents]}
                    eventContent={(arg) => {
                        const { dayIndex, slotIndex, status, key, identity, templateId, clientKey } = arg.event
                            .extendedProps as any;
                        const date = arg.event.startStr?.split("T")[0] ?? "";
                        const startHms = arg.event.startStr?.split("T")[1]?.slice(0, 8) ?? "00:00:00";
                        const startHM = arg.event.startStr?.split("T")[1]?.slice(0, 5) ?? "";
                        const endHM = arg.event.endStr?.split("T")[1]?.slice(0, 5) ?? startHM;
                        const isPast = isPastByStart(date, startHms);
                        const isDraft = !templateId;
                        const isBooked = status === 2;
                        const isSelected = selectedKeys.has(key);
                        const isMarked = identity ? markedForDeletion.has(identity) : false;

                        // Base label (keep existing title rendering)
                        const title = arg.event.title;
                        const mergedLabel = `${startHM} - ${endHM} • ${title}`;

                        // Build a container with hover overlay
                        const container = document.createElement("div");
                        container.className = "relative group h-full flex items-center justify-center";

                        const titleDiv = document.createElement("div");
                        titleDiv.className = "px-2 py-1 text-xs font-medium w-full text-center";
                        titleDiv.textContent = mergedLabel;
                        container.appendChild(titleDiv);

                        // Only show overlay when not booked and not past
                        if (!isBooked && !isPast) {
                            const overlay = document.createElement("div");
                            overlay.className =
                                "pointer-events-none absolute inset-0 hidden items-center justify-center gap-2 rounded-md bg-black/20 group-hover:flex";

                            // Helper to create an icon button (render React Lucide icon into DOM)
                            const makeIconBtn = (label: string, icon: any, onClick: () => void) => {
                                const btn = document.createElement("button");
                                btn.type = "button";
                                btn.className =
                                    "pointer-events-auto inline-flex h-7 w-7 items-center justify-center rounded bg-white/90 text-[#248FCA] shadow hover:bg-white";
                                btn.title = label;
                                btn.onclick = (e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    onClick();
                                };
                                const mount = document.createElement("div");
                                const root = createRoot(mount);
                                root.render(icon);
                                btn.appendChild(mount);
                                return btn;
                            };
                            

                            // Select (only for non-draft)
                            if (!isDraft) {
                                overlay.appendChild(
                                    makeIconBtn("Chọn / Bỏ chọn", <MousePointer2 className="h-4 w-4" />, () => {
                                        setSelectedKeys((prev) => {
                                            const next = new Set(prev);
                                            if (next.has(key)) next.delete(key);
                                            else next.add(key);
                                            return next;
                                        });
                                    })
                                );
                            }

                            // Delete (toggle mark or remove draft immediately)
                            overlay.appendChild(
                                makeIconBtn("Xóa", <Trash2 className="h-4 w-4" />, () => {
                                    // For draft: remove immediately from UI
                                    if (!templateId) {
                                        const nextState = cloneSchedule(scheduleData);
                                        const d = nextState.timeTemplates.find((t) => t.date === date);
                                        if (d) {
                                            d.times = d.times.filter((_, idx) => idx !== slotIndex);
                                            if (d.times.length === 0) {
                                                nextState.timeTemplates = nextState.timeTemplates.filter((t) => t.date !== date);
                                            }
                                        }
                                        const identityDraft = clientKey ? `draft:${clientKey}` : "";
                                        if (identityDraft) {
                                            changedKeysRef.current.delete(identityDraft);
                                            setTimeout(() => upsertChanged(nextState), 0);
                                        }
                                        setScheduleData(nextState);
                                        return;
                                    }
                                    // Existing slot: toggle mark for deletion
                                    setMarkedForDeletion((prev) => {
                                        const next = new Set(prev);
                                        const ident = identity;
                                        if (ident) {
                                            if (next.has(ident)) {
                                                next.delete(ident);
                                                if (templateId)
                                                    deletedIdsRef.current = deletedIdsRef.current.filter((id) => id !== templateId);
                                            } else {
                                                next.add(ident);
                                                if (templateId)
                                                    deletedIdsRef.current = [...deletedIdsRef.current, templateId];
                                            }
                                        }
                                        return next;
                                    });
                                    setTimeout(() => upsertChanged(), 0);
                                })
                            );

                            // Edit icon only for status=1 or draft
                            if (status === 1 || isDraft) {
                                overlay.appendChild(
                                    makeIconBtn("Sửa", <SquarePen className="h-4 w-4" />, () => {
                                        // Mirror handleEventClick logic
                                        if (isPastByStart(date, startHms)) {
                                            addToast({
                                                type: "error",
                                                description: "Thời gian đã qua, không thể chỉnh sửa.",
                                                duration: 3000,
                                            });
                                            return;
                                        }
                                        if (status === 2) return;
                                        const selectedDate = selectedWeekData.dates[dayIndex];
                                        const day = scheduleData.timeTemplates.find((d) => d.date === selectedDate);
                                        const slot = day?.times[slotIndex];
                                        if (!slot) return;
                                        setEditStart(ensureHms(slot.start).slice(0, 5));
                                        setEditEnd(ensureHms(slot.end).slice(0, 5));
                                        setEditTarget({ dayIndex, slotIndex, mode: "edit" });
                                        setDialogOpen(true);
                                    })
                                );
                            }

                            container.appendChild(overlay);
                        }

                        return { domNodes: [container] } as any;
                    }}
                    eventClassNames={(info) => {
                        const { key, status, identity } = info.event
                            .extendedProps as any;
                        const classes: string[] = [];
                        if (selectedKeys.has(key)) classes.push("selected");
                        if (identity && markedForDeletion.has(identity))
                            classes.push("to-delete");
                        if (status === 2)
                            classes.push("opacity-70 cursor-not-allowed");
                        // Past timeslots are visually disabled
                        const date = info.event.startStr?.split("T")[0] ?? "";
                        const startHms =
                            info.event.startStr?.split("T")[1]?.slice(0, 8) ??
                            "00:00:00";
                        if (isPastByStart(date, startHms)) {
                            classes.push("opacity-60 cursor-not-allowed");
                        }
                        return classes;
                    }}
                    select={handleDateSelect}
                    selectAllow={(arg) => {
                        const date = arg.startStr.split("T")[0];
                        const hms =
                            arg.startStr.split("T")[1]?.slice(0, 8) ??
                            "00:00:00";
                        const allowed = !isPastByStart(date, hms);
                        if (!allowed) {
                            addToast({
                                type: "error",
                                description:
                                    "Thời gian đã qua, không thể chỉnh sửa.",
                                duration: 3000,
                            });
                        }
                        return allowed;
                    }}
                    eventAllow={(dropInfo) => {
                        const targetDate = dropInfo.startStr.split("T")[0];
                        const hms =
                            dropInfo.startStr.split("T")[1]?.slice(0, 8) ??
                            "00:00:00";
                        const allowed = !isPastByStart(targetDate, hms);
                        if (!allowed) {
                            addToast({
                                type: "error",
                                description:
                                    "Thời gian đã qua, không thể chỉnh sửa.",
                                duration: 3000,
                            });
                        }
                        return allowed;
                    }}
                    eventClick={handleEventClick}
                    eventDrop={handleEventDrop}
                    eventResize={handleEventResize}
                    eventOverlap={true}
                />

                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {editTarget?.mode === "create"
                                    ? "Thêm khung giờ"
                                    : "Sửa khung giờ"}
                            </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Bắt đầu
                                </label>
                                <Input
                                    type="time"
                                    value={editStart}
                                    onChange={(e) =>
                                        setEditStart(e.target.value)
                                    }
                                    disabled={!canEditTime}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Kết thúc
                                </label>
                                <Input
                                    type="time"
                                    value={editEnd}
                                    onChange={(e) => setEditEnd(e.target.value)}
                                    disabled={!canEditTime}
                                />
                            </div>
                            {(() => {
                                if (!editTarget) return null;
                                const key = `${editTarget.dayIndex}-${editTarget.slotIndex}`;
                                const date =
                                    selectedWeekData.dates[editTarget.dayIndex];
                                const day = scheduleData.timeTemplates.find(
                                    (d) => d.date === date
                                );
                                const slot = day?.times[editTarget.slotIndex];
                                const status = slot?.status ?? 0;
                                return null;
                            })()}
                        </div>
                        <DialogFooter className="gap-2">
                            <Button
                                onClick={persistEdit}
                                className="bg-[#248FCA] hover:bg-[#248FCA]/90 cursor-pointer"
                                disabled={
                                    !editTarget ||
                                    currentSlot?.status === 2 ||
                                    (!editStart &&
                                        !editEnd &&
                                        selectedKeys.size === 0 &&
                                        markedForDeletion.size === 0)
                                }
                            >
                                <Save />
                                Lưu
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    );
}
