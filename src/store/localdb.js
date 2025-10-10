// src/store/localdb.js
// Minimal, predictable wrapper around localStorage for EMS (Employee Management System)

const NS = "ems:v1"; // data namespace
const META_KEY = "ems:meta"; // holds { version }
const VERSION = 1;

// ---- utils ----
function nsKey(name) {
    return `${NS}:${name}`;
}

function parseJSON(value, fallback) {
    try {
        return JSON.parse(value);
    } catch {
        return fallback;
    }
}

function safeGetItem(key, fallback = null) {
    try {
        const raw = localStorage.getItem(key);
        if (raw == null) return fallback;
        return raw;
    } catch {
        return fallback;
    }
}

function safeSetItem(key, value) {
    try {
        localStorage.setItem(key, value);
        return true;
    } catch {
        return false;
    }
}

function nowISTLabel(d = new Date()) {
    // "Sep 20, 2025 11:34:21 hrs" (IST)
    const parts = new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: "Asia/Kolkata",
    }).formatToParts(d);
    const get = (t) => parts.find((p) => p.type === t)?.value || "";
    return `${get("month")} ${get("day")}, ${get("year")} ${get("hour")}:${get(
        "minute"
    )}:${get("second")} hrs`;
}

// ---- meta / versioning ----
function ensureMeta() {
    const raw = safeGetItem(META_KEY);
    const meta = parseJSON(raw, null);
    if (!meta || typeof meta !== "object" || typeof meta.version !== "number") {
        safeSetItem(
            META_KEY,
            JSON.stringify({ version: VERSION, initializedAt: nowISTLabel() })
        );
        return { version: VERSION };
    }
    // place for migrations if VERSION > meta.version in future
    return meta;
}

// ---- core API ----
export const localdb = {
    // low-level get/set/remove for strings
    getRaw(name, fallback = null) {
        return safeGetItem(nsKey(name), fallback);
    },

    setRaw(name, rawValue /* string */) {
        return safeSetItem(nsKey(name), rawValue);
    },

    remove(name) {
        try {
            localStorage.removeItem(nsKey(name));
            return true;
        } catch {
            return false;
        }
    },

    // JSON helpers
    getJSON(name, fallback = null) {
        const raw = safeGetItem(nsKey(name));
        return parseJSON(raw, fallback);
    },

    setJSON(name, value) {
        return safeSetItem(nsKey(name), JSON.stringify(value));
    },

    // list all namespaced keys
    keys() {
        try {
            const out = [];
            for (let i = 0; i < localStorage.length; i++) {
                const k = localStorage.key(i);
                if (k && k.startsWith(`${NS}:`)) out.push(k);
            }
            return out;
        } catch {
            return [];
        }
    },

    // clear only our namespace
    clearNamespace() {
        const ks = localdb.keys();
        ks.forEach((k) => {
            try {
                localStorage.removeItem(k);
            } catch {}
        });
        // keep META so version stays recorded
        ensureMeta();
    },

    // simple namespaced collections (arrays)
    getAll(collection) {
        const arr = localdb.getJSON(collection, []);
        return Array.isArray(arr) ? arr : [];
    },

    setAll(collection, arr) {
        return localdb.setJSON(collection, Array.isArray(arr) ? arr : []);
    },

    // backup/export entire namespace (except META optional)
    exportDump({ includeMeta = true } = {}) {
        const dump = {};
        const keys = localdb.keys();
        keys.forEach((k) => {
            if (!includeMeta && k === META_KEY) return;
            dump[k] = safeGetItem(k, null);
        });
        if (includeMeta) {
            dump[META_KEY] = safeGetItem(
                META_KEY,
                JSON.stringify({ version: VERSION })
            );
        }
        return {
            createdAt: nowISTLabel(),
            namespace: NS,
            version: VERSION,
            data: dump,
        };
    },

    // import/restore dump (overwrites namespace keys)
    importDump(dump) {
        if (!dump || typeof dump !== "object" || !dump.data)
            return { ok: false, error: "Invalid dump" };
        const data = dump.data;
        // wipe current namespace (except META to avoid partial leftover)
        localdb.clearNamespace();
        // write all keys from dump
        try {
            Object.keys(data).forEach((k) => {
                const v = data[k];
                // guard only our namespace + META
                if (k.startsWith(`${NS}:`) || k === META_KEY) {
                    if (v == null) return;
                    safeSetItem(k, String(v));
                }
            });
            // ensure meta exists
            ensureMeta();
            return { ok: true };
        } catch (e) {
            return { ok: false, error: String(e?.message || e) };
        }
    },

    // convenience timestamps
    nowISTLabel,
};

// initialize meta on first import
ensureMeta();
export default localdb;
