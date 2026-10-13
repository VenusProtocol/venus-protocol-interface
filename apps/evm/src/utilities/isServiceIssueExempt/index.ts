import { SERVICE_ISSUE_EXEMPT_ENDPOINTS } from 'constants/serviceIssueEndpoints';

import type { RestServiceInput } from '../restService';

export const isServiceIssueExempt = ({
  method,
  endpoint,
}: Pick<RestServiceInput, 'method' | 'endpoint'>) => {
  const segments = endpoint.split('?')[0].split('/');

  return SERVICE_ISSUE_EXEMPT_ENDPOINTS.some(exemptEndpoint => {
    const exemptSegments = exemptEndpoint.endpoint.split('/');

    return (
      exemptEndpoint.method === method &&
      exemptSegments.length === segments.length &&
      exemptSegments.every(
        (segment, index) => segment.startsWith(':') || segment === segments[index],
      )
    );
  });
};
