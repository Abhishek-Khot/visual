/** Mask a secret, showing first N chars */
export function maskSecret(value: string, showFirst = 0): string {
    if (showFirst > 0 && value.length > showFirst) {
        return value.slice(0, showFirst) + '***MASKED***';
    }
    return '***MASKED***';
}

/** Format a 0..1 float as percentage string */
export function pct(value: number): string {
    return `${Math.round(value * 100)}%`;
}

/** Pretty-print a duration in ms */
export function formatDuration(ms: number): string {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
}

/** Format number with commas */
export function formatNumber(n: number): string {
    return n.toLocaleString();
}
