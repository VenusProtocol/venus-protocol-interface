## API Patterns Reference

## 3-layer architecture

```txt
Component/Page
  -> named hook from `clients/api`
    -> fetch function in `clients/api/queries/*/index.ts` (read)
    -> transaction hook in `clients/api/mutations/*/index.ts` (write)
      -> infrastructure utilities (`restService`, `publicClient.readContract`, `useSendTransaction`)
```

Components should consume named hooks from `clients/api`.  
Do not call `restService`, `publicClient.readContract`, or raw `useQuery` directly in page/component code.

## Layer 1 - Fetch functions (`queries/*/index.ts`)

Live in `apps/evm/src/clients/api/queries/{feature}/index.ts`.  
Platform/domain logic only, no React hooks.

```typescript
import { VError } from 'libs/errors';
import { restService } from 'utilities';

export interface GetMarketsTvlOutput {
  suppliedSumCents: string;
  borrowedSumCents: string;
}

export const getMarketsTvl = async (): Promise<GetMarketsTvlOutput> => {
  const response = await restService<GetMarketsTvlOutput>({
    endpoint: '/markets/tvl',
    method: 'GET',
  });

  const payload = response.data;

  if (payload && 'error' in payload) {
    throw new VError({
      type: 'unexpected',
      code: 'somethingWentWrong',
      data: { exception: payload.error },
    });
  }

  if (!payload) {
    throw new VError({ type: 'unexpected', code: 'somethingWentWrong' });
  }

  return payload;
};
```

On-chain reads also belong to this layer:

```typescript
export const getTokenUsdPrice = async ({
  token,
  publicClient,
  resilientOracleAddress,
}: GetTokenUsdPriceInput): Promise<GetTokenUsdPriceOutput> => {
  const priceMantissa = await publicClient.readContract({
    address: resilientOracleAddress,
    abi: resilientOracleAbi,
    functionName: 'getPrice',
    args: [token.address],
  });

  return {
    tokenPriceUsd: convertPriceMantissaToDollars({
      priceMantissa: priceMantissa.toString(),
      decimals: token.decimals,
    }),
  };
};
```

### Fetch function rules

- Keep IO contracts explicit (`GetXInput` / `GetXOutput` types).
- Export public types from the module (`export * from './types'` when used).
- Normalize/format backend payloads in this layer (e.g. `formatSwapQuote`, `formatDataPoints`).
- Throw `VError` with meaningful `type`/`code` instead of returning partial error objects.

## Layer 2 - Named query hooks (`useGet*.ts`)

Live in `apps/evm/src/clients/api/queries/{feature}/useGet*.ts` (or `index.ts` for grouped hooks).
This is the only layer that should call `useQuery` / `useQueries`.

```typescript
import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';
import FunctionKey from 'constants/functionKey';
import { useChainId } from 'libs/wallet';
import { callOrThrow } from 'utilities';

type Options = QueryObserverOptions<
  GetTokenUsdPriceOutput,
  Error,
  GetTokenUsdPriceOutput,
  GetTokenUsdPriceOutput,
  UseGetTokenUsdPriceQueryKey
>;

export const useGetTokenUsdPrice = ({ token }: UseGetTokenUsdPriceInput, options?: Partial<Options>) => {
  const { chainId } = useChainId();
  const { publicClient } = usePublicClient();
  const { address: resilientOracleAddress } = useGetContractAddress({ name: 'ResilientOracle' });

  return useQuery({
    queryKey: [
      FunctionKey.GET_TOKEN_USD_PRICE,
      { tokenAddress: token ? token.address : '', chainId },
    ],
    queryFn: () =>
      callOrThrow({ token, resilientOracleAddress }, params =>
        getTokenUsdPrice({ publicClient, ...params }),
      ),
    ...options,
    enabled: (options?.enabled === undefined || options?.enabled) && !!token,
  });
};
```

### Options interface patterns

**Simple (pass-through options):**

```typescript
type Options = QueryObserverOptions<Output, Error, Output, Output, [FunctionKey.GET_X, Input]>;
export const useGetX = (input: Input, options?: Partial<Options>) =>
  useQuery({ queryKey: [FunctionKey.GET_X, input], queryFn: () => getX(input), ...options });
```

**With placeholder & polling defaults:**

```typescript
const refetchInterval = generatePseudoRandomRefetchInterval();

export const useGetVoters = (params: GetVotersInput, options?: Partial<Options>) =>
  useQuery({
    queryKey: [FunctionKey.GET_VOTERS, params],
    queryFn: () => getVoters(params),
    placeholderData: keepPreviousData,
    refetchInterval,
    ...options,
  });
```

**Fan-out queries (`useQueries`) for indexed resources:**

```typescript
const queries: UseQueryOptions<PoolOutput>[] = [];

for (let poolIndex = 0; poolIndex < poolsCount; poolIndex++) {
  queries.push({
    queryKey: [FunctionKey.GET_XVS_VAULT_POOL_INFOS, { chainId, poolIndex }],
    queryFn: () => getXvsVaultPoolInfo({ publicClient, poolIndex, ...deps }),
  });
}

return useQueries({ queries });
```

### Hook-level composition

Compose derived hooks when it improves reuse:

```typescript
// useGetAsset -> uses useGetPools data and selects one asset by vToken address
const { data: getPoolsData, isLoading } = useGetPools({ accountAddress });
```

## Layer 3 - Mutation hooks (`mutations/use*.ts`)

In Venus, write operations are standardized through `useSendTransaction` (internally wraps `useMutation`).
Mutation hooks should not call `useMutation` directly unless there is a strong infra reason.

```typescript
type SupplyInput = { vToken: VToken; amountMantissa: BigNumber; poolName: string };
type Options = UseSendTransactionOptions<SupplyInput>;

export const useSupply = (options?: Partial<Options>) =>
  useSendTransaction({
    fn: input => ({
      abi: vBep20Abi,
      address: input.vToken.address,
      functionName: 'mint',
      args: [BigInt(input.amountMantissa.toFixed())],
    }),
    onConfirmed: ({ input }) => {
      queryClient.invalidateQueries({ queryKey: [FunctionKey.GET_POOLS] });
      queryClient.invalidateQueries({
        queryKey: [FunctionKey.GET_TOKEN_BALANCES, { chainId, accountAddress }],
      });
    },
    options,
  });
```

### Mutation hook rules

- Define typed input (`type XInput`) and `UseSendTransactionOptions<XInput>`.
- Validate prerequisites and throw `VError` (`somethingWentWrong`, `incorrectSwapInput`, etc).
- Use `onConfirmed` to invalidate affected cache keys.
- Keep side effects (analytics/toasts/modal triggers) in hook callbacks, not in components.

## Cache key rules

Use `FunctionKey` enum as the first queryKey element for every query.

```typescript
queryKey: [FunctionKey.GET_POOLS, { chainId, accountAddress }]
```

### Guidelines

- Include every cache-shaping param (`chainId`, `accountAddress`, token addresses, ids).
- Keep queryKey serializable and deterministic.
- For broad refreshes, invalidate by key prefix:

```typescript
queryClient.invalidateQueries({ queryKey: [FunctionKey.GET_POOLS] });
```

- For scoped refreshes, include matching param object:

```typescript
queryClient.invalidateQueries({
  queryKey: [FunctionKey.GET_BALANCE_OF, { chainId, accountAddress, tokenAddress }],
});
```

## Component consumption

Components/pages import hooks from `clients/api`:

```typescript
import { useGetPools, useBorrow, useSupply } from 'clients/api';
```

### Correct

```typescript
function PoolWidget() {
  const { data, isLoading } = useGetPools({ accountAddress });
  // render...
}
```

### Wrong

```typescript
// Wrong - direct data fetch in component
const response = await restService({ endpoint: '/markets/tvl', method: 'GET' });

// Wrong - bypassing clients/api query hooks in UI layer
const { data } = useQuery({ queryKey: ['x'], queryFn: getSomething });
```

## Error handling patterns

### REST/read errors

- Detect API error payloads (`payload && 'error' in payload`) and throw `VError`.
- Throw on missing payload (`!payload`) with domain-appropriate code.

### Dependency guards

Use `callOrThrow` for required dependencies before executing fetch/query functions:

```typescript
callOrThrow({ token, resilientOracleAddress }, params => getTokenUsdPrice({ publicClient, ...params }));
```

### Transaction errors

- `useSendTransaction` handles gasless fallback and forwards `options.onError`.
- Domain mutation hooks should throw `VError` for invalid branch/input combinations.

## Domain module file structure

```txt
apps/evm/src/clients/api/queries/{feature}/
├── index.ts                     # fetch function(s) + exports
├── useGet{Feature}.ts           # useQuery wrapper hook
├── types.ts                     # input/output/api response types (when needed)
├── format*/                     # response transformers (optional)
└── __tests__/                   # unit tests

apps/evm/src/clients/api/mutations/use{Action}/
├── index.ts                     # useSendTransaction wrapper hook
└── __tests__/                   # hook behavior tests
```

## Blocklist - avoid these patterns

- Calling `restService` directly from components/pages.
- Calling `publicClient.readContract` in component/page rendering logic.
- Query keys without `FunctionKey`.
- Returning raw API payloads when formatting/normalization is required for domain usage.
- Mutation hooks that forget to invalidate affected query caches.
