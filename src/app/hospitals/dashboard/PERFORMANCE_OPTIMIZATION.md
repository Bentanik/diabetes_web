# Dashboard Performance Optimization

## Vấn đề ban đầu
API theo năm chạy chậm hơn API theo tháng do:
1. **Xử lý dữ liệu phức tạp**: Năm cần xử lý 12 tháng vs tháng chỉ cần xử lý tối đa 31 ngày
2. **Logic xử lý nặng**: Sử dụng `reduce()` và vòng lặp `find()` không hiệu quả
3. **Re-render không cần thiết**: Component re-render mỗi khi state thay đổi
4. **Cache không tối ưu**: API luôn được gọi lại do `staleTime: 0`
5. **Chart rendering chậm**: 12 điểm dữ liệu theo năm vs 31 điểm dữ liệu theo tháng

## Các tối ưu hóa đã thực hiện

### 1. Tối ưu hóa Chart Component (`consultation-chart.tsx`) - ĐÃ CẬP NHẬT
- **Sử dụng `React.memo`**: Tránh re-render không cần thiết
- **Sử dụng `useMemo`**: Cache kết quả xử lý dữ liệu
- **Thay thế `reduce()` bằng `Map`**: Tăng hiệu suất tìm kiếm từ O(n) lên O(1)
- **Pre-allocate array**: Sử dụng `new Array(12)` thay vì `push()`
- **Tối ưu vòng lặp**: Sử dụng `for` thay vì `for...of` để tăng hiệu suất
- **Memoize CustomTooltip**: Tránh tạo component mới mỗi lần render

```typescript
// Trước: Sử dụng reduce() và for...of - chậm
const monthlyData = chartData.reduce((acc: any, item) => {
    // ... logic phức tạp
}, {});

// Sau: Sử dụng Map và for loop - nhanh hơn nhiều
const monthlyDataMap = new Map();
const dataLength = chartData.length;
for (let i = 0; i < dataLength; i++) {
    const item = chartData[i];
    // ... logic đơn giản hơn
}
```

### 2. Tối ưu hóa Hook (`use-consultation-dashboard.ts`) - ĐÃ CẬP NHẬT
- **Sử dụng `useMemo`**: Cache kết quả transform dữ liệu
- **Sử dụng `useCallback`**: Tránh tạo function mới mỗi lần render
- **Tối ưu hóa vòng lặp**: Sử dụng Map thay vì `find()`
- **Pre-allocate array**: Tạo array với kích thước cố định
- **Tối ưu hóa loading state**: Sử dụng `useMemo` để tính toán loading
- **Tối ưu hóa vòng lặp**: Sử dụng `for` thay vì `for...of`

```typescript
// Trước: Sử dụng find() - chậm O(n)
const dayData = apiData.days.find((d: any) => d.day === day);

// Sau: Sử dụng Map - nhanh O(1)
const dayMap = new Map();
const daysLength = days.length;
for (let i = 0; i < daysLength; i++) {
    const dayData = days[i];
    dayMap.set(dayData.day, dayData);
}
const dayData = dayMap.get(day);
```

### 3. Tối ưu hóa API Hooks (ĐÃ CẬP NHẬT)
- **Đặt `staleTime: 0`**: Luôn coi data là stale để gọi lại API mỗi lần select
- **Đặt `gcTime: 0`**: Không giữ cache để đảm bảo gọi API mới
- **Thêm `refetchOnReconnect: true`**: Gọi lại API khi reconnect
- **Giữ `refetchOnMount: true`**: Luôn gọi lại khi mount

```typescript
// Cấu hình mới: Mỗi lần select đều gọi API mới
staleTime: 0,                    // Luôn gọi API mới
gcTime: 0,                       // Không giữ cache
refetchOnWindowFocus: false,     // Tắt refetch khi focus window
refetchOnMount: true,            // Gọi lại khi mount
refetchOnReconnect: true,        // Gọi lại khi reconnect
```

**Lý do thay đổi**: Người dùng muốn mỗi lần select năm/tháng đều gọi API mới để có dữ liệu mới nhất, thay vì sử dụng cache cũ.

### 4. Tối ưu hóa Component Chính (`index.tsx`) - ĐÃ CẬP NHẬT
- **Sử dụng `React.memo`**: Tránh re-render không cần thiết
- **Sử dụng `useMemo`**: Cache các giá trị tính toán
- **Sử dụng `useCallback`**: Tránh tạo function mới
- **Tối ưu hóa render**: Chỉ render khi cần thiết
- **Early return**: Tránh render dashboard content khi không cần

```typescript
// Trước: Function được tạo mỗi lần render
const getStatisticsType = () => { ... };

// Sau: Sử dụng useMemo và React.memo
const statisticsType = useMemo(() => {
    // ... logic
}, [selectedYear, selectedMonth]);

const ManageConsultation = memo(() => {
    // ... component logic
});
```

### 5. Tối ưu hóa mới cho dữ liệu theo năm
- **Tối ưu hóa vòng lặp**: Sử dụng `for` thay vì `for...of` để tăng hiệu suất
- **Pre-allocate arrays**: Tạo array với kích thước cố định trước khi sử dụng
- **Tối ưu hóa Map operations**: Sử dụng `set()` và `get()` hiệu quả
- **Memoize components**: Sử dụng `React.memo` để tránh re-render

## Kết quả mong đợi

### Trước khi tối ưu:
- **API theo tháng**: Nhanh (31 điểm dữ liệu)
- **API theo năm**: Chậm (12 điểm dữ liệu + xử lý phức tạp)
- **Re-render**: Nhiều lần không cần thiết
- **Cache**: Không hiệu quả
- **Chart rendering**: Chậm với dữ liệu theo năm

### Sau khi tối ưu:
- **API theo tháng**: Vẫn nhanh
- **API theo năm**: Cải thiện đáng kể (tối ưu hóa vòng lặp và Map operations)
- **Re-render**: Giảm thiểu (React.memo, useMemo, useCallback)
- **API calls**: Mỗi lần select đều gọi API mới (theo yêu cầu)
- **Chart rendering**: Nhanh hơn với dữ liệu theo năm

## Các tối ưu hóa bổ sung có thể thực hiện

### 1. Virtualization cho Chart
- Sử dụng `react-window` hoặc `react-virtualized` cho chart có nhiều điểm dữ liệu
- Chỉ render các điểm dữ liệu visible

### 2. Lazy Loading
- Load dữ liệu theo từng phần
- Sử dụng pagination cho dữ liệu lớn

### 3. Web Workers
- Xử lý dữ liệu phức tạp trong background thread
- Không block main thread

### 4. Service Worker
- Cache API responses
- Offline support

### 5. Debouncing
- Tránh gọi API quá nhiều khi user thay đổi selection nhanh

## Monitoring Performance

### 1. React DevTools Profiler
- Kiểm tra component re-render
- Đo thời gian render

### 2. Chrome DevTools Performance
- Đo thời gian JavaScript execution
- Kiểm tra memory usage

### 3. Network Tab
- Đo thời gian API calls
- Kiểm tra cache headers

## Kết luận

Các tối ưu hóa này sẽ cải thiện đáng kể hiệu suất của dashboard, đặc biệt là khi xử lý dữ liệu theo năm. Sử dụng `React.memo`, `useMemo`, `useCallback`, và các cấu trúc dữ liệu hiệu quả (Map, pre-allocated arrays) sẽ giúp giảm thời gian xử lý và số lần re-render không cần thiết.

**Lưu ý quan trọng**: 
1. Với cấu hình cache mới (`staleTime: 0`, `gcTime: 0`), mỗi lần select năm/tháng đều sẽ gọi API mới để đảm bảo dữ liệu luôn mới nhất.
2. Các tối ưu hóa về vòng lặp và Map operations sẽ cải thiện đáng kể hiệu suất khi xử lý dữ liệu theo năm.
3. Sử dụng `React.memo` sẽ giảm thiểu số lần re-render không cần thiết.
