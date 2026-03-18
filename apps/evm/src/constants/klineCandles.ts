import type { Period } from 'klinecharts';

import type { ApiOhlcInterval } from 'types';

export const INTERVAL: ApiOhlcInterval = '1h';

export const CHART_PERIOD: Period = { span: 1, type: 'hour' };
