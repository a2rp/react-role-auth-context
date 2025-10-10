// src/hooks/useLocalCollection.js
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { localdb } from "../store/localdb";

/**
 * LocalStorage-backed collection hook for EMS
 * - CRUD (soft/hard), search/sort/showDeleted
 * - import/export
 * - recent ids -> sessionStorage: ems:recent:<collection>
 * - cross-instance sync (BroadcastChannel + CustomEvent + storage)
 * - ✅ PERSIST-ON-MUTATE: writes to LS immediately before navigation
 */
export default function useLocalCollection(collection, options = {}) {
    const {
        searchFields = ["name", "id"],
        sortInitial = { by: "updatedAt", dir: "desc" },
        makeId = defaultMakeId,
    } = options;

    // ---------- state ----------
    const [items, setItems] = useState(() => localdb.getAll(collection));
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState(sortInitial);
    const [showDeleted, setShowDeleted] = useState(false);

    // instance id (avoid echo loops)
    const instanceId = useRef(Math.random().toString(36).slice(2));
    const bcRef = useRef(null);

    // ---------- helpers ----------
    function defaultMakeId() {
        const p = (collection?.[0] || "x") + (collection?.[1] || "x");
        return `${p}_${Date.now().toString(36)}_${Math.random()
            .toString(36)
            .slice(2, 7)}`;
    }

    const refresh = useCallback(() => {
        const fresh = localdb.getAll(collection);
        setItems((prev) => {
            // shallow check (length + ids) to avoid unnecessary renders
            if (
                Array.isArray(prev) &&
                prev.length === fresh.length &&
                prev.every((x, i) => x?.id === fresh[i]?.id)
            )
                return prev;
            return fresh;
        });
    }, [collection]);

    const notify = useCallback(() => {
        // same-tab
        try {
            window.dispatchEvent(
                new CustomEvent("ems:collection-updated", {
                    detail: { collection, sourceId: instanceId.current },
                })
            );
        } catch {}
        // cross-tab
        try {
            if (!bcRef.current && "BroadcastChannel" in window) {
                bcRef.current = new BroadcastChannel("ems-bus");
            }
            bcRef.current?.postMessage({
                type: "collection-updated",
                collection,
                sourceId: instanceId.current,
            });
        } catch {}
    }, [collection]);

    // listen: custom event + BroadcastChannel + storage
    useEffect(() => {
        const onCustom = (e) => {
            const d = e.detail || {};
            if (
                d.collection !== collection ||
                d.sourceId === instanceId.current
            )
                return;
            refresh();
        };
        window.addEventListener("ems:collection-updated", onCustom);

        let bc;
        try {
            if ("BroadcastChannel" in window) {
                bc = new BroadcastChannel("ems-bus");
                bc.onmessage = (e) => {
                    const m = e?.data || {};
                    if (m.type !== "collection-updated") return;
                    if (
                        m.collection !== collection ||
                        m.sourceId === instanceId.current
                    )
                        return;
                    refresh();
                };
            }
        } catch {}

        const onStorage = (e) => {
            if (e.key === `ems:v1:${collection}`) refresh();
        };
        window.addEventListener("storage", onStorage);

        return () => {
            window.removeEventListener("ems:collection-updated", onCustom);
            window.removeEventListener("storage", onStorage);
            try {
                bc && bc.close();
            } catch {}
        };
    }, [collection, refresh]);

    const markRecent = useCallback(
        (id) => {
            if (!id) return;
            const key = `ems:recent:${collection}`;
            try {
                const raw = sessionStorage.getItem(key);
                let arr = [];
                if (raw) {
                    const v = JSON.parse(raw);
                    if (Array.isArray(v)) arr = v;
                    else if (typeof v === "string") arr = [v];
                    else if (v && typeof v === "object" && v.id) arr = [v.id];
                }
                const next = [id, ...arr.filter((x) => x !== id)].slice(0, 10);
                sessionStorage.setItem(key, JSON.stringify(next));
            } catch {}
        },
        [collection]
    );

    // ---------- PERSIST-ON-MUTATE OPS ----------
    const create = useCallback(
        (partial) => {
            const id = partial?.id || makeId();
            if (items.some((x) => x.id === id)) throw new Error("Duplicate id");
            const now = localdb.nowISTLabel();
            const rec = {
                id,
                ...partial,
                createdAt: partial?.createdAt || now,
                updatedAt: now,
                isDeleted: !!partial?.isDeleted === true ? true : false,
            };
            const next = [rec, ...items];
            localdb.setAll(collection, next); // write immediately
            setItems(next);
            markRecent(id);
            queueMicrotask?.(notify);
            return id;
        },
        [items, makeId, collection, markRecent, notify]
    );

    const update = useCallback(
        (id, patch) => {
            let found = false;
            const now = localdb.nowISTLabel();
            const next = items.map((x) => {
                if (x.id === id) {
                    found = true;
                    return { ...x, ...patch, updatedAt: now };
                }
                return x;
            });
            if (!found) throw new Error("Record not found");
            localdb.setAll(collection, next);
            setItems(next);
            markRecent(id);
            queueMicrotask?.(notify);
        },
        [items, collection, markRecent, notify]
    );

    const remove = useCallback(
        (id) => {
            update(id, { isDeleted: true });
        },
        [update]
    );

    const restore = useCallback(
        (id) => {
            update(id, { isDeleted: false });
        },
        [update]
    );

    const removeHard = useCallback(
        (id) => {
            const next = items.filter((x) => x.id !== id);
            localdb.setAll(collection, next);
            setItems(next);
            queueMicrotask?.(notify);
        },
        [items, collection, notify]
    );

    const bulkRemove = useCallback(
        (ids = []) => {
            const stamp = localdb.nowISTLabel();
            const next = items.map((x) =>
                ids.includes(x.id)
                    ? { ...x, isDeleted: true, updatedAt: stamp }
                    : x
            );
            localdb.setAll(collection, next);
            setItems(next);
            queueMicrotask?.(notify);
        },
        [items, collection, notify]
    );

    const bulkRestore = useCallback(
        (ids = []) => {
            const stamp = localdb.nowISTLabel();
            const next = items.map((x) =>
                ids.includes(x.id)
                    ? { ...x, isDeleted: false, updatedAt: stamp }
                    : x
            );
            localdb.setAll(collection, next);
            setItems(next);
            queueMicrotask?.(notify);
        },
        [items, collection, notify]
    );

    const clear = useCallback(() => {
        localdb.setAll(collection, []);
        setItems([]);
        queueMicrotask?.(notify);
    }, [collection, notify]);

    const setAll = useCallback(
        (nextArray) => {
            const next = Array.isArray(nextArray) ? nextArray : [];
            localdb.setAll(collection, next);
            setItems(next);
            queueMicrotask?.(notify);
        },
        [collection, notify]
    );

    // ---------- import/export ----------
    const exportData = useCallback(
        () => JSON.stringify(items, null, 2),
        [items]
    );

    /**
     * importData(data, { mode })
     * mode: 'replace' (default) | 'merge'
     */
    const importData = useCallback(
        (data, { mode = "replace" } = {}) => {
            const arr = Array.isArray(data) ? data : [];
            if (mode === "replace") {
                localdb.setAll(collection, arr);
                setItems(arr);
                queueMicrotask?.(notify);
                return { ok: true, count: arr.length, mode };
            }
            // merge
            const byId = new Map(items.map((x) => [x.id, x]));
            for (const r of arr) {
                if (!r?.id) continue;
                byId.set(r.id, { ...(byId.get(r.id) || {}), ...r });
            }
            const merged = Array.from(byId.values());
            localdb.setAll(collection, merged);
            setItems(merged);
            queueMicrotask?.(notify);
            return { ok: true, count: arr.length, mode };
        },
        [items, collection, notify]
    );

    // ---------- search + sort + showDeleted ----------
    const tokens = useMemo(() => {
        const q = search.trim().toLowerCase();
        return q ? q.split(/\s+/).filter(Boolean) : [];
    }, [search]);

    const filtered = useMemo(() => {
        const pool = showDeleted ? items : items.filter((x) => !x.isDeleted);
        if (tokens.length === 0) return pool;

        const hasAll = (txt) => tokens.every((t) => txt.includes(t));
        return pool.filter((x) => {
            const hay = searchFields
                .map((f) => (x?.[f] == null ? "" : String(x[f]).toLowerCase()))
                .join(" ");
            return hasAll(hay);
        });
    }, [items, tokens, searchFields, showDeleted]);

    const view = useMemo(() => {
        const by = sort?.by || "updatedAt";
        const dir = sort?.dir === "asc" ? 1 : -1;

        const safe = (v) => (v == null ? "" : v);
        const num = (v) => (typeof v === "number" ? v : Number(v));
        const isNumLike = (v) => !Number.isNaN(Number(v));

        const copy = [...filtered];
        copy.sort((a, b) => {
            const av = safe(a[by]);
            const bv = safe(b[by]);
            if (isNumLike(av) && isNumLike(bv))
                return (num(av) - num(bv)) * dir;
            const as = String(av).toLowerCase();
            const bs = String(bv).toLowerCase();
            if (as < bs) return -1 * dir;
            if (as > bs) return 1 * dir;
            return 0;
        });
        return copy;
    }, [filtered, sort]);

    // ---------- API ----------
    return {
        // data
        items,
        view,
        get: useCallback(
            (id) => {
                const it = items.find((x) => x.id === id) || null;
                if (it) markRecent(it.id);
                return it;
            },
            [items, markRecent]
        ),
        setAll,
        clear,
        refresh,

        // query
        search,
        setSearch,
        sort,
        setSort,
        showDeleted,
        setShowDeleted,

        // ops
        create,
        update,
        remove,
        restore,
        removeHard,
        bulkRemove,
        bulkRestore,

        // io
        exportData,
        importData,

        // recent
        markRecent,
    };
}
