import {RGBA} from "sharp";

export const DEFAULT_CENTER = { lat: 47.369821, lon: -122.03415 };

export const API_CONFIG = {
    BASE_URL: "https://roadmonitor.riaas.io/api/v2",
    IMAGE_BASE_URL: "https://roadmonitor.gcdn.ntruss.com",
    TOKEN: process.env.NEXT_PUBLIC_ROADMONITOR_TOKEN ||
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiMDQ2MjM2ZTEtNzBhNS00NDA5LWFjY2QtNjM3NWU4MWYwZTA5IiwiZXhwIjoxNzU1NTc3ODQ0LCJzdWIiOiJkbmEwM0ByaWFhcy5haSIsInVzZXJfaWQiOjI1OSwidXNlcl9ubSI6ImRuYTAzIiwiY3VzdF9pZCI6ODcsImpicHNfbm0iOm51bGwsImNucGwiOm51bGwsImFkbWluX3luIjoiTiIsIm9wcnRyX3luIjoiTiIsInRtX3pvbmUiOiJBbWVyaWNhL0xvc19BbmdlbGVzIiwibG9jYWxlX2NkIjoiZW5fVVMiLCJ1dGNfb2Zmc2V0IjoiLTA3OjAwIiwibGduX2F0dGVtcHRfY250IjowLCJsYXN0X2xnbl9kdCI6IjIwMjUtMDgtMTEgMDg6MTA6MjcuNzA1MTY5KzAwOjAwIiwicHN3ZF9zdHRzX2NkIjowLCJwc3dkX21kZmNuX2R0IjoiMjAyNS0wNy0xNiAwODoyNDowMC4wMjAzNDYrMDA6MDAifQ._jlftV-_2Q_DZ2buQIPXqW80HcFdqF8xx8UEZs6h6ac",
    CUSTOMER_ID: "87",
    DATE_RANGE: {
        START: "2025-07-20T00:00:00",
        END: "2025-07-26T23:59:59",
    },
};

export const ANIMATION = {
    MAP_TRANSITION: 1200,
    MARKER_TRANSITION: 800,
    PLAYBACK_INTERVAL_MS: 2500,
};

export const MARKER = {
    REGULAR: { fillColor: [34, 197, 94, 180] as RGBA, radius: 4 },
    SELECTED: { fillColor: [239, 68, 68, 255] as RGBA, radius: 8 },
};

export const ZOOM = {
    LINE_MODE_MAX: 13,
    POINT_MODE_MIN: 13.00001,
};

export const MAP_STYLE = "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json";
