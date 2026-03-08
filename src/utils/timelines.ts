import type { SpeedOption } from '../types';

/** Base delay in ms per step at 1x speed */
const BASE_DELAY = 4000;

/** Get auto-advance delay for current speed */
export function getStepDelay(speed: SpeedOption): number {
    return BASE_DELAY / speed;
}
