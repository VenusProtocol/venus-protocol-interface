import { request } from 'graphql-request';

import {
  IsolatedPoolParticipantsCountDocument,
  subgraphEndpoint,
} from 'clients/subgraph/gql/queries';

export const getIsolatedPoolParticipantsCount = () =>
  request(subgraphEndpoint, IsolatedPoolParticipantsCountDocument);
