/** Deterministic seeded score from step ID */
export function seededScore(stepId: string): number {
    let hash = 0;
    for (let i = 0; i < stepId.length; i++) {
        hash = ((hash << 5) - hash) + stepId.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash % 100) / 100;
}
