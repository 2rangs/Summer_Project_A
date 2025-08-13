import { ScanItem } from './types';
import { API_CONFIG } from './constants';

export const isFiniteNumber = (n: unknown): n is number =>
    typeof n === "number" && Number.isFinite(n);

export const getCoordinates = (item: ScanItem): [number, number] => {
    const lon = Number(item.link_lot ?? item.lot);
    const lat = Number(item.link_lat ?? item.lat);
    return [lon, lat];
};

export const isValidCoordinatePair = (lon: number, lat: number) =>
    isFiniteNumber(lon) &&
    isFiniteNumber(lat) &&
    lon >= -180 &&
    lon <= 180 &&
    lat >= -90 &&
    lat <= 90 &&
    !(lon === 0 && lat === 0);

export const formatDateTime = (dateStr?: string): string => {
    if (!dateStr) return "-";
    const t = new Date(dateStr);
    if (Number.isNaN(t.getTime())) return dateStr;
    return t.toLocaleString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
};

export const formatDate = (dateStr: string): string => {
    const t = new Date(dateStr);
    if (Number.isNaN(t.getTime())) return dateStr;
    return t.toLocaleDateString("ko-KR", {
        month: "2-digit",
        day: "2-digit",
        weekday: "short",
    });
};

export const getDateKey = (dateStr?: string): string => {
    if (!dateStr) return "";
    const t = new Date(dateStr);
    if (Number.isNaN(t.getTime())) return "";
    return t.toISOString().split("T")[0]!;
};

export const getImageUrl = (fileName: string): string =>
    fileName?.startsWith("http")
        ? fileName
        : `${API_CONFIG.IMAGE_BASE_URL}/${fileName}`;