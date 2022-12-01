#!/bin/bash

if [[ -z "${SUBGRAPH_GRAPHQL_ENDPOINT}" ]]; then
  export SUBGRAPH_GRAPHQL_ENDPOINT="https://api.thegraph.com/subgraphs/name/venusprotocol/venus-isolated-pools-chapel"
fi

yarn graphclient build --dir ./src/types/subgraph/
