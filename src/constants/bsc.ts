export const BLOCK_VALIDATION_RATE_IN_SECONDS = 3;
// 20 blocks a minute, 60 minutes an hours, 24 hours a day
export const BLOCKS_PER_DAY = (60 / BLOCK_VALIDATION_RATE_IN_SECONDS) * 60 * 24;
