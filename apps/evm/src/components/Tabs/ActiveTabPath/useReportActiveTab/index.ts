import { useContext } from 'react';

import { ReportActiveTabContext } from '../context';

export const useReportActiveTab = () => useContext(ReportActiveTabContext);
