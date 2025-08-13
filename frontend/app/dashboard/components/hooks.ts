import { useState, useEffect, useCallback } from 'react';
import { ApiListResponse, ApiDetailResponse } from './types';
import { API_CONFIG } from './constants';

export const useApiList = () => {
    const [resp, setResp] = useState<ApiListResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();
        const run = async () => {
            try {
                setLoading(true);
                setError(null);
                const url = new URL(`${API_CONFIG.BASE_URL}/scans/simple`);
                url.searchParams.set("cust_id", API_CONFIG.CUSTOMER_ID);
                url.searchParams.set("bgng_dt", API_CONFIG.DATE_RANGE.START);
                url.searchParams.set("end_dt", API_CONFIG.DATE_RANGE.END);
                url.searchParams.set("limit", "100000");

                const r = await fetch(url.toString(), {
                    headers: { Authorization: `Bearer ${API_CONFIG.TOKEN}` },
                    signal: controller.signal,
                });
                if (!r.ok) throw new Error(`HTTP ${r.status}`);
                const data: ApiListResponse = await r.json();

                data.data.items.sort((a, b) => {
                    const ta = new Date(a.capture_dt ?? 0).getTime();
                    const tb = new Date(b.capture_dt ?? 0).getTime();
                    return ta - tb;
                });

                setResp(data);
            } catch (e: any) {
                if (e?.name !== "AbortError") setError(String(e));
            } finally {
                setLoading(false);
            }
        };
        run();
        return () => controller.abort();
    }, []);

    return { resp, error, loading };
};

export const useScanDetail = () => {
    const [detail, setDetail] = useState<ApiDetailResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchDetail = useCallback(async (scanId: string) => {
        setLoading(true);
        setError(null);
        try {
            const r = await fetch(
                `${API_CONFIG.BASE_URL}/scans/${encodeURIComponent(scanId)}`,
                { headers: { Authorization: `Bearer ${API_CONFIG.TOKEN}` } }
            );
            if (!r.ok) {
                let msg = `HTTP ${r.status}`;
                try {
                    const errJson = await r.json();
                    msg = `HTTP ${r.status}: ${JSON.stringify(errJson)}`;
                } catch {}
                throw new Error(msg);
            }
            const data: ApiDetailResponse = await r.json();
            setDetail(data);
        } catch (e: any) {
            setError(String(e));
        } finally {
            setLoading(false);
        }
    }, []);

    const reset = useCallback(() => {
        setDetail(null);
        setError(null);
        setLoading(false);
    }, []);

    return { detail, error, loading, fetchDetail, reset };
};