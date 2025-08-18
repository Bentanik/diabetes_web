"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import type { DateSelectArg, EventClickArg, EventDropArg, EventInput } from "@fullcalendar/core";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import useToast from "@/hooks/use-toast";

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

const ensureHms = (time: string) => (time.split(":").length === 2 ? `${time}:00` : time);
const toIso = (date: string, time: string) => `${date}T${ensureHms(time)}`;
const cloneSchedule = (src: { timeTemplates: DaySchedule[] }): { timeTemplates: DaySchedule[] } => ({
	timeTemplates: src.timeTemplates.map((d) => ({
		date: d.date,
		times: d.times.map((t) => ({ ...t })),
	})),
});

const slotIdentity = (slot: TimeSlot) => (slot.id ? `id:${slot.id}` : `draft:${slot.clientKey}`);

const toMinutes = (t: string) => {
	const [hh, mm] = ensureHms(t).split(":").map((v) => parseInt(v, 10));
	return hh * 60 + mm;
};

const hasOverlap = (times: TimeSlot[], start: string, end: string, ignoreIndex?: number) => {
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
	const [markedForDeletion, setMarkedForDeletion] = useState<Set<string>>(new Set());
	const [bulkStatus, setBulkStatus] = useState<string>("");

	const currentSlot = useMemo(() => {
		if (!editTarget) return null;
		const date = selectedWeekData.dates[editTarget.dayIndex];
		const day = scheduleData.timeTemplates.find((d) => d.date === date);
		return day?.times[editTarget.slotIndex] ?? null;
	}, [editTarget, selectedWeekData.dates, scheduleData.timeTemplates]);

	const canEditTime = useMemo(() => {
		if (!editTarget) return false;
		if (editTarget.mode === "create") return true; // always editable when creating
		if (!currentSlot) return false;
		if (currentSlot.status === 2) return false; // booked
		// editable if draft (no id) or status=1
		return !currentSlot.id || currentSlot.status === 1;
	}, [editTarget, currentSlot]);

	useEffect(() => {
		// Sync calendar's visible week with the selected week (use Monday date)
		if (selectedWeekData?.dates?.length) {
			const startDate = selectedWeekData.dates[0];
			const api = calendarRef.current?.getApi?.();
			if (api) {
				api.gotoDate(startDate);
			}
		}
	}, [selectedWeekData?.dates?.[0]]);

	useEffect(() => {
		// reset tracking after submit
		changedKeysRef.current = new Set();
		deletedIdsRef.current = [];
		onChangedSlotsUpdate([]);
		onDeletedIdsUpdate([]);
		setSelectedKeys(new Set());
		setBulkStatus("");
	}, [resetSignal]);

	// If user selects a bulk status but forgets to click Apply, still include selected slots in upsert
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

	const events: EventInput[] = useMemo(() => {
		const evts: EventInput[] = [];
		selectedWeekData.dates.forEach((date, dayIndex) => {
			const day = scheduleData.timeTemplates.find((d) => d.date === date);
			day?.times.forEach((slot, slotIndex) => {
				const status = slot.status ?? 1; // default display as 1 if undefined
				const key = `${dayIndex}-${slotIndex}`;
				const isDraft = !slot.id;
				evts.push({
					id: slot.id || key,
					title: isDraft ? "Nháp" : status === 2 ? "Đã đặt" : status === 1 ? "Không công khai" : "Công khai",
					start: toIso(date, slot.start),
					end: toIso(date, slot.end),
					editable: isDraft || status === 1,
					backgroundColor: isDraft ? "#248FCA" : status === 2 ? "#6b7280" : status === 1 ? "#f59e0b" : "#059669",
					borderColor: isDraft ? "#248FCA" : status === 2 ? "#6b7280" : status === 1 ? "#f59e0b" : "#059669",
					extendedProps: { dayIndex, slotIndex, templateId: slot.id ?? null, status, key, clientKey: slot.clientKey, identity: slotIdentity(slot) },
				});
			});
		});
		return evts;
	}, [scheduleData.timeTemplates, selectedWeekData.dates]);

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
					timeRange: { start: ensureHms(slot.start), end: ensureHms(slot.end) },
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
		return { next, day } as { next: { timeTemplates: DaySchedule[] }; day: DaySchedule };
	};

	const validateSlotAndToast = (day: DaySchedule, start: string, end: string, ignoreIndex?: number) => {
		const s = toMinutes(start);
		const e = toMinutes(end);
		if (e - s < 15) {
			addToast({ type: "error", description: "Khoảng thời gian tối thiểu là 15 phút", duration: 3000 });
			return false;
		}
		if (hasOverlap(day.times, start, end, ignoreIndex)) {
			addToast({ type: "error", description: "Khung giờ bị chồng lấn trong cùng ngày", duration: 3000 });
			return false;
		}
		return true;
	};

	const handleDateSelect = (arg: DateSelectArg) => {
		const date = arg.startStr.split("T")[0];
		const start = new Date(arg.start);
		const end = new Date(start.getTime() + 30 * 60 * 1000);
		setEditStart(start.toTimeString().slice(0, 5));
		setEditEnd(end.toTimeString().slice(0, 5));
		const dayIndex = selectedWeekData.dates.findIndex((d) => d === date);
		setEditTarget({ dayIndex, slotIndex: -1, mode: "create" });
		setDialogOpen(true);
	};

	const handleEventClick = (arg: EventClickArg) => {
		const { dayIndex, slotIndex, status } = arg.event.extendedProps as any;
		if (status === 2) return; // status=2 do nothing
		const date = selectedWeekData.dates[dayIndex];
		const day = scheduleData.timeTemplates.find((d) => d.date === date);
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
			if (!validateSlotAndToast(day, newStart, newEnd)) return;
			const clientKey = `draft-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
			day.times.push({ start: newStart, end: newEnd, status: 1, clientKey });
			changedKeysRef.current.add(`draft:${clientKey}`);
		} else {
			const slot = day.times[editTarget.slotIndex];
			if (slot) {
				if (!validateSlotAndToast(day, newStart, newEnd, editTarget.slotIndex)) return;
				slot.start = newStart;
				slot.end = newEnd;
				slot.status = slot.status ?? 1;
				const keyStr = `${editTarget.dayIndex}-${editTarget.slotIndex}`;
				const identity = slotIdentity(slot);
				if (selectedKeys.has(keyStr)) {
					changedKeysRef.current.add(identity);
				} else {
					changedKeysRef.current.delete(identity);
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
			next.timeTemplates = next.timeTemplates.filter((d) => d.date !== date);
		}
		setScheduleData(next);
		setDialogOpen(false);
		upsertChanged(next);
	};

	const handleEventDrop = (arg: EventDropArg) => {
		const { dayIndex, slotIndex, status, templateId, clientKey } = arg.event.extendedProps as any;
		if (!(status === 1 || !templateId)) return; // allow draft or status=1
		const newDate = arg.event.startStr.split("T")[0];
		const newStart = arg.event.startStr.split("T")[1]?.slice(0, 8) ?? "00:00:00";
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
			next.timeTemplates = next.timeTemplates.filter((d) => d.date !== oldDate);
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
		const moved: TimeSlot = { ...slot, start: newStart, end: newEnd, status: slot.status ?? 1 };
		newDay.times.push(moved);
		setScheduleData(next);
		const identity = moved.id ? `id:${moved.id}` : `draft:${moved.clientKey}`;
		changedKeysRef.current.add(identity);
		upsertChanged(next);
		onStatusChange?.(1);
	};

	const handleEventResize = (arg: any) => {
		const { dayIndex, slotIndex, status, templateId } = arg.event.extendedProps as any;
		if (!(status === 1 || !templateId)) return; // allow draft or status=1
		const date = selectedWeekData.dates[dayIndex];
		const next = cloneSchedule(scheduleData);
		const day = next.timeTemplates.find((d) => d.date === date);
		if (!day) return;
		if (!day.times[slotIndex]) return;
		const slot = day.times[slotIndex];
		const newStart = arg.event.startStr.split("T")[1]?.slice(0, 8) ?? slot.start;
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
								<Select value={bulkStatus} onValueChange={setBulkStatus}>
									<SelectTrigger className="h-8 w-[180px] text-xs">
										<SelectValue placeholder="Chọn trạng thái" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="0">Công khai</SelectItem>
										<SelectItem value="1">Không công khai</SelectItem>
									</SelectContent>
								</Select>
								<Button
									size="sm"
									disabled={bulkStatus === ""}
									className="h-8"
									onClick={() => {
										if (bulkStatus === "") return;
										const next = cloneSchedule(scheduleData);
										Array.from(selectedKeys).forEach((keyStr) => {
											const [d, s] = keyStr.split("-").map(Number);
											const date = selectedWeekData.dates[d];
											const day = next.timeTemplates.find((t) => t.date === date);
											if (!day) return;
											const slot = day.times[s];
											if (!slot) return;
											slot.status = Number(bulkStatus);
											changedKeysRef.current.add(slotIdentity(slot));
										});
									setScheduleData(next);
									upsertChanged(next);
									onStatusChange?.(Number(bulkStatus));
									setBulkStatus("");
									setSelectedKeys(new Set());
								}}
							>
								Áp dụng
							</Button>
						</>
						)}
					</div>
				</CardTitle>
			</CardHeader>
			<CardContent className="h-[600px]">
				<style jsx global>{`
					.fc .fc-timegrid-slots tr { height: 48px; }
					.fc .fc-timegrid-slot { height: 48px; }
					.fc .fc-timegrid-event { min-height: 36px; border-radius: 8px; }
					.fc .fc-timegrid-event.selected { background-color: #258FCA !important; border-color: #258FCA !important; }
					.fc .fc-timegrid-event.to-delete { background-color: #dc2626 !important; border-color: #dc2626 !important; }
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
					events={events}
					eventClassNames={(info) => {
						const { key, status, identity } = info.event.extendedProps as any;
						const classes: string[] = [];
						if (selectedKeys.has(key)) classes.push("selected");
						if (identity && markedForDeletion.has(identity)) classes.push("to-delete");
						if (status === 2) classes.push("opacity-70 cursor-not-allowed");
						return classes;
					}}
					select={handleDateSelect}
					eventClick={handleEventClick}
					eventDrop={handleEventDrop}
					eventResize={handleEventResize}
					eventOverlap={true}
				/>

				<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>
								{editTarget?.mode === "create" ? "Thêm khung giờ" : "Sửa khung giờ"}
							</DialogTitle>
						</DialogHeader>
						<div className="space-y-4 pt-2">
							<div className="space-y-2">
								<label className="text-sm font-medium">Bắt đầu</label>
								<Input
									type="time"
									value={editStart}
									onChange={(e) => setEditStart(e.target.value)}
									disabled={!canEditTime}
								/>
							</div>
							<div className="space-y-2">
								<label className="text-sm font-medium">Kết thúc</label>
								<Input
									type="time"
									value={editEnd}
									onChange={(e) => setEditEnd(e.target.value)}
									disabled={!canEditTime}
								/>
							</div>
							<p className="text-sm text-gray-500">Trạng thái mặc định lưu là "Không công khai" cho slot mới/chỉnh sửa.</p>

							{(() => {
								if (!editTarget) return null;
								const key = `${editTarget.dayIndex}-${editTarget.slotIndex}`;
								const date = selectedWeekData.dates[editTarget.dayIndex];
								const day = scheduleData.timeTemplates.find((d) => d.date === date);
								const slot = day?.times[editTarget.slotIndex];
								const status = slot?.status ?? 0;
								const isSelected = selectedKeys.has(key);
								const identity = slot ? slotIdentity(slot) : "";
								const isMarked = identity ? markedForDeletion.has(identity) : false;
								const isDraft = !slot?.id;
								return (
									<div className="flex gap-2 pt-2">
										{!isDraft && (
											<Button
												variant={isSelected ? "secondary" : "default"}
												className="bg-[#248FCA] hover:bg-[#248FCA]/90"
												onClick={() => {
													setSelectedKeys((prev) => {
														const next = new Set(prev);
														if (next.has(key)) next.delete(key);
														else next.add(key);
														return next;
													});
												}}
												disabled={status === 2}
											>
												{isSelected ? "Bỏ chọn" : "Chọn"}
											</Button>
										)}
										<Button
											variant={isMarked ? "secondary" : "destructive"}
											onClick={() => {
												if (!slot?.id) {
													// Remove draft slot immediately from UI
													const nextState = cloneSchedule(scheduleData);
													const d = nextState.timeTemplates.find((t) => t.date === date);
													if (d) {
														d.times = d.times.filter((_, idx) => idx !== editTarget!.slotIndex);
														if (d.times.length === 0) {
															nextState.timeTemplates = nextState.timeTemplates.filter((t) => t.date !== date);
														}
													}
													// remove from changed if present
													const identityDraft = slot?.clientKey ? `draft:${slot.clientKey}` : "";
													if (identityDraft) {
														changedKeysRef.current.delete(identityDraft);
														setTimeout(() => upsertChanged(nextState), 0);
													}
													setScheduleData(nextState);
													setDialogOpen(false);
													return;
												}
											// Toggle mark-for-deletion for existing slots (with id)
											setMarkedForDeletion((prev) => {
												const next = new Set(prev);
												const ident = slotIdentity(slot!);
												if (next.has(ident)) {
													next.delete(ident);
													if (slot?.id) deletedIdsRef.current = deletedIdsRef.current.filter((id) => id !== slot.id);
												} else {
													next.add(ident);
													if (slot?.id) deletedIdsRef.current = [...deletedIdsRef.current, slot.id];
												}
												return next;
											});
											setTimeout(() => upsertChanged(), 0);
										}}
										disabled={status === 2}
									>
										{isDraft ? "Xóa khung giờ" : isMarked ? "Bỏ đánh dấu xóa" : "Đánh dấu xóa"}
									</Button>
								</div>
							);
						})()}
						</div>
						<DialogFooter className="gap-2">
							<Button
								onClick={persistEdit}
								className="bg-[#248FCA] hover:bg-[#248FCA]/90"
								disabled={!editTarget || (currentSlot?.status === 2)}
							>
								Lưu
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</CardContent>
		</Card>
	);
}


