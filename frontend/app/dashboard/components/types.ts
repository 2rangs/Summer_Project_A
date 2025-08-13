// app/dashboard/components/types.ts
export type RGBA = [number, number, number, number];

export interface ScanItem {
    scan_id?: string;
    capture_dt?: string;
    lat?: number | string;
    lot?: number | string;
    link_lat?: number | string;
    link_lot?: number | string;
    road_img_file_nm?: string;
    dvc_id?: string;
    [key: string]: unknown;
}

export interface ViewState {
    longitude: number;
    latitude: number;
    zoom: number;
    pitch: number;
    bearing: number;
    transitionDuration?: number;
}

export interface ApiListResponse {
    code: number;
    message: string;
    data: {
        total: number;
        count: number;
        items: ScanItem[];
    };
    errors?: unknown;
}

export interface ApiDetailResponse {
    code: number;
    message: string;
    data: ScanItem;
    errors?: unknown;
}

export interface DateGroup {
    date: string;
    displayDate: string;
    items: ScanItem[];
}