#!/bin/bash

if [[ "${REACT_APP_CHAIN_ID}" == "56" ]]; then
  export SUBGRAPH_GRAPHQL_ENDPOINT="https://api.thegraph.com/subgraphs/name/venusprotocol/venus-isolated-pools"
else
  export SUBGRAPH_GRAPHQL_ENDPOINT="https://api.thegraph.com/subgraphs/name/venusprotocol/venus-isolated-pools-chapel"
fi

yarn graphql-code-generator --config ./src/clients/subgraph/codegen.ts
