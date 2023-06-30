import config from 'config';
import { request } from 'graphql-request';

import gql from 'clients/subgraph/gql';

export const getIsolatedPoolParticipantsCount = () =>
  request(config.subgraphUrl, gql.IsolatedPoolParticipantsCountDocument);
