# Prime Leaderboard V2 — API ↔ Frontend 比对 & 计划

权威来源: **venus-protocol-api PR #962 `feat/prime-v2`**(真实实现,非 stub;取代旧的 feat/prime-leaderboard-v2-api 分析)
FE branch: `feat/prime-leaderboard-api`(off rank-card,链尾)

## 关键约定
- **chainId 必传**(query param)。当前**只支持 BSC_TESTNET (97)**(`SNAPSHOT_PG_SUPPORTED_CHAINS=[BSC_TESTNET]`)。非法 chain → 400。
- 分页:`?page&limit`,响应含 `page/limit/total`。
- 金额:`...UsdCents`(string,美分)/ `...Mantissa`(string)。时间:Date(序列化为 ISO)。
- 地址:响应里 `hexToAddress` 转成 checksum。

## 端点(6 个,真实查询 snapshot DB)

### 1. `GET /prime/leaderboard?chainId&page&limit&address?`
当前榜单。`result[]`: `{ userAddress, rank, effectiveStakeMantissa, totalStakedMantissa, isPrimeHolder }`;外层 `{ chainId, blockNumber, computedAt, page, limit, total, result }`。`address?` 传了可定位该用户。
→ **RankTable**。

### 2. `GET /prime/cycle/current?chainId`
`{ chainId, cycle, pendingPool }`
- `cycle`: `{ cycleIndex, status, startsAt, endsAt, anchorBlockNum, mintLimitUsed }`
- `pendingPool`: `{ blockNumber, computedAt, primeHolderCount, totalPendingUsdCents }`
→ **endOfCycleDate**(`cycle.endsAt`)、EndOfCycle 周期起(`startsAt`)、**TotalRewards 池**(`pendingPool.totalPendingUsdCents`)、刷新时间(`computedAt`)。

### 3. `GET /prime/users/:address/pending-rewards?chainId`
`{ chainId, userAddress, blockNumber, isPrimeHolder, rank, totalPendingUsdCents, rewards[] }`
`rewards[]`: `{ marketAddress, rewardTokenAddress, pendingAmountMantissa, pendingUsdCents }`
→ **RankCard**(rank/isPrimeHolder)、**UserRewards 卡**(totalPendingUsdCents + 每市场 rewards)。

### 4. `GET /prime/cycles?chainId&page&limit`
已结算周期列表。`result[]`: `{ cycleIndex, startsAt, endsAt, mintLimitUsed, totalRewardPoolUsdCents, finalizedAt }`。
→ 判断「是否有上一周期」(决定 first-cycle 形态)+ 取 last cycle index。

### 5. `GET /prime/cycles/:cycleIndex?chainId`  (cycleIndex 可为 `latest`)
`{ chainId, cycle, markets[], ranking[] }`
- `cycle`: FinalizedCycleRow + `status`
- `markets[]`: `{ marketAddress, rewardTokenAddress, tokenDistributionSpeedMantissa, supplyMultiplierMantissa, borrowMultiplierMantissa, totalRewardMantissa, totalRewardUsdCents }`
- `ranking[]`: `{ userAddress, finalRank, finalEffectiveStakeMantissa, finalTotalStakedMantissa }`
→ **LastCycleSummaryModal**(用 `latest` 或上一 index)。

### 6. `GET /prime/cycles/:cycleIndex/users/:address?chainId`
`{ chainId, cycleIndex, userAddress, totalRewardUsdCents, markets[] }`
markets[]: `{ marketAddress, rewardTokenAddress, totalRewardMantissa, totalRewardUsdCents }`
→ LastCycleSummaryModal 里的「用户上周期奖励」。

## 比对:前端占位 → API

| FE 占位 | API 来源 | 状态 |
|---|---|---|
| `useGetPrimeRank`.rank / isPrime | #3 rank / isPrimeHolder | ✅ |
| RankTable placeholderRanks | #1 leaderboard | ✅ |
| RewardTable placeholderRewards | #1 leaderboard(+ 各用户 reward 需 #3?或 leaderboard 不含 reward → 用 #1 排名 + ？) | ⚠️ 见缺口 |
| useGetPrimeTotalRewards | #2 pendingPool.totalPendingUsdCents | ✅ 总额;**每市场拆分**见缺口 |
| useGetPrimeUserRewards | #3 totalPendingUsdCents + rewards[] | ✅ |
| LastCycleSummaryModal total/user | #5 + #6 | ✅ |
| endOfCycleDate | #2 cycle.endsAt | ✅ |
| lastRefreshedAt | #2 pendingPool.computedAt / #1 computedAt | ✅ |
| primeScore(榜单显示的分数) | #1 `effectiveStakeMantissa`(≈ score) | ✅(注意是 mantissa,不是 cents) |

## 缺口处理(已和后端/PRD 敲定)

### ✅ 已解决
1. **`hasStakedXvs`** = `totalStakedMantissa > 0`(#1 传 `address` 取自己那行)或合约 `getEffectiveStake(user) > 0`。
2. **`hasSupplied`** = 项目现有 pools 数据:合格 Prime 市场(vUSDT/vUSDC/vBTC/vETH)里 `asset.userSupplyBalanceTokens > 0`。**不是** API 字段。
3. **`gapXvsTokens`**:Gleiser 确认后端出**第 500 名(榜底)的量**;前端算 `gap = bottomStake − userStake + 1`(他举例 10000 − 7000 + 1 = 3001)。
   - 榜底量 ← **新路由(待 Gleiser 加)**
   - 用户自己 stake ← 合约 `getEffectiveStake(user)` 或 #1 `effectiveStakeMantissa`
   - 注意:这是**按 effective stake 的简化算法**(非 PRD 那套 boost×days 投影);后端 & FE 已对齐用简化版。
   - 显示规则:`gap ≤ 100_000`(`TOP_500_GAP_THRESHOLD_XVS`,已存在常量)→ 显示具体数;否则泛化文案。
4. **每市场 Prime APY (`apyPercentage`)**:用项目现有 **Prime APY**(非 supply apy):
   - `getHypotheticalPrimeApys` → Base & Prime **模拟** APY(非供给/未连接态)
   - `useGetPools` 的 `getUserPrimeApys` → **实际** Prime APY(已供给态)
   - 展示组件:`pages/Market/OperationForm/ApyBreakdown`
6. **API base URL**:用项目现有 `clients/api` / restService 约定,无需单独 base。

### ⏳ 仍等后端(Gleiser)
A. **Prime Score(排名分 542.5M)**:#1 行只有 `effectiveStakeMantissa`,无加权 score。
   - 自己那行:可前端用合约 `getDeposits`+`getMultiplier` 算;
   - 但**整张榜单每行(最多 500)算不了**(ranking 是链下的,文档 §1 "Ranking is OFF-CHAIN")→ **必须后端在 #1 行里返回 prime score**。
B. **榜底(第 500 名)量** 的新路由(gap 用)—— Gleiser 已答应加。
C. **当前周期每市场 reward 拆分**(Card B 明细):#2 `pendingPool` 只有总额。过去周期(#5)有每市场,当前周期没有 → 确认从哪取。

## 合约(BSC 测试网 97,来自 PrimeV2-testnet-integration 文档)
- PrimeLeaderboard proxy: `0x1a4408613eec291f2d338F7A88E9D550fa9cD8dC`
- PrimeV2 proxy: `0xeC22366d2572e52BCB29B50C905b945BA421B9b2`
- XVS Vault proxy: `0x9aB56bAD2D7631B2A857ccf36d998232A8b82280`(Prime pool id 测试网 = 1)
- 合格市场:vUSDT `0xb7526572FFE56AB9D7489838Bf2E18e3323b441A`、vUSDC `0xD5C4C2e2facBEB59D0216D0595d63FcDc6F9A1a7`、vBTC `0xb6e9322C49FD75a367Fcb17B0Fcd62C5070EbCBe`、vETH `0x162D005F0Fff510E54958Cfc5CF32A3180A84aab`
- 倍率:<30d=1.0x / ≥30d=1.3x / ≥60d=1.6x / ≥90d=2.0x(90d 封顶);mintThreshold=1 XVS;tokenLimit=500
- PrimeLeaderboard 读接口:`getEffectiveStake(user)` / `getEffectiveStakeBatch` / `getTotalStaked` / `getDeposits` / `getMultiplier` / `getMultiplierTiers`
- ⚠️ 前端目前**只有 Prime v1 ABI**,PrimeV2/PrimeLeaderboard ABI 还没进 `@venusprotocol` 包 / `generated/abis`。若 gap 要读合约,需先补 ABI;否则尽量靠后端路由避免接 v2 合约。

## 团队聊天补充的产品决策(影响 FE,与 API 无关)
- **第一周期特殊形态**(Maxime 定):reward table 为空 → **隐藏 reward table,仅显示 rank table**;EndOfCycle 文案**去掉「See last cycle's Prime summary」CTA**(还没上一周期)。→ 用 #4 `/prime/cycles` 是否为空判断 first-cycle。
- fresh start;测试网倍率压缩(0-1h/1-2h/2-3h/≥3h)。

## FE 接入计划(clients/api 规范)
建 6 组 `getXxx + useGetXxx`(`FunctionKey.GET_PRIME_*`,queryKey 含 chainId+address+page+cycleIndex):
1 leaderboard → RankTable;2 currentCycle → totalRewards/endDate;3 userPending → RankCard/userRewards;4 cycles → first-cycle 判断;5 pastCycle + 6 userCycleRewards → LastCycleSummaryModal。
现有 3 个本地占位 hook 改为包装这些,组件 props 不变。

## 可先做(不阻塞于缺口/部署)
- first-cycle 隐藏 reward table + 去 CTA(用 #4 判断,逻辑可先写、数据后接)。
