#!/bin/sh

if [[ "${VITE_ENVIRONMENT}" == "preview" || "${VITE_ENVIRONMENT}" == "mainnet" ]]; then
  export SUBGRAPH_GRAPHQL_ENDPOINT="https://api.thegraph.com/subgraphs/name/venusprotocol/venus-isolated-pools"
else
  export SUBGRAPH_GRAPHQL_ENDPOINT="https://api.thegraph.com/subgraphs/name/venusprotocol/venus-isolated-pools-chapel"
fi

yarn graphql-code-generator --config ./src/clients/subgraph/codegen.ts
