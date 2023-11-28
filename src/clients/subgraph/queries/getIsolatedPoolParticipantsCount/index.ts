import { request } from 'graphql-request';

import gql from 'clients/subgraph/gql';
import config from 'config';

export const getIsolatedPoolParticipantsCount = () =>
  request(config.subgraphUrl, gql.IsolatedPoolParticipantsCountDocument);
