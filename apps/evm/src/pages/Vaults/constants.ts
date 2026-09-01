export const CATEGORY_PARAM_KEY = 'category';
export const VENUE_PARAM_KEY = 'venue';
export const STATUS_PARAM_KEY = 'status';

// Every group the user can filter on, so clearing all of them stays in one place
export const FILTER_PARAM_KEYS = [CATEGORY_PARAM_KEY, VENUE_PARAM_KEY, STATUS_PARAM_KEY] as const;
