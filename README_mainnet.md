# RAYDIUM SDK V2 demo

## About the project

This project is for [RAYDIUM SDK V2](https://github.com/raydium-io/raydium-sdk-V2) demonstration

## Getting Started

### Installation

`yarn install`

this will install the dependencies for running the demo script

### Prerequisites

Modify `config.ts.template` to fit your configuration, and rename it to `config.ts`

- `<YOUR_WALLET_SECRET_KEY>`: replace to your own one
- `<YOUR_RPC_URL>`: replace to your prefer one
- `<API_HOST>`: by default it's no needed to provide raydium api host, only provide it when test on devnet.

### Usage

- `yarn dev src/<FOLDER>/<SCRIPT_NAME>` run the specific demo script, e.g. yarn dev src/cpmm/deposit.ts. **Note: if you want to execute tx, remember to uncomment code in last line**
- `yarn clmm-market 8sLbNZoA1cfnvMJLPfp98ZLAnFSYCFApfJKMbiXNLwxj 10 20` run clmm market maker, arguments 0: poolId, 1: create position deviation, 2: close position deviation, remember to uncomment `close position` and `create new position` code part

### Sdk Methods

#### Transaction methods return data

all transaction related build function (e.g. await raydium.clmm.openPositionFromBase/ await raydium.cpmm.createPool ..etc) will return all transactions and instructions

```
const { execute, transaction, builder, extInfo } = await raydium.clmm.openPositionFromBase({ xxx })

```

- `transaction or transactions`: all built transactions
- `builder`: all instructions in transaction. e.g. builder.allInstructions, builder.AllTxData
- `extInfo`: transaction related publicKeys. (e.g: extInfo from raydium.cpmm.createPool includes poolId, programId...etc)

#### Fetch pool list by mints (mainnet only)

```
import { PoolFetchType } from '@raydium-io/raydium-sdk-v2'

const list = await raydium.api.fetchPoolByMints({
  mint1: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R', // required
  mint2: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // optional
  type: PoolFetchType.All, // optional
  sort: 'liquidity', // optional
  order: 'desc', // optional
  page: 1, // optional
})
```

### Fetch Mint info from Api or Rpc

```
await raydium.token.getTokenInfo('<Mint address>')
```

### Fetch token account

```
await raydium.account.fetchWalletTokenAccounts() // if need to force fetching token account, pass param { forceUpdate: true }
```

### More api methods [check here](https://github.com/raydium-io/raydium-sdk-V2?tab=readme-ov-file#api-methods-httpsgithubcomraydium-ioraydium-sdk-v2blobmastersrcapiapits)

### FAQ

#### Error: block height exceeded / exceeded CUs meter at BPF instruction

- transactions were expired, set higher priority fees (computeBudgetConfig) to make it go through smoothly
- if you are testing in devnet, remember to replace programId to devnet one.

#### raydium.api.fetchPoolById/raydium.api.fetchFarmInfoById return null

- currently api doesn't support devnet pool/farm data, please test on mainnet.
- only raydium.xxxx.getRpcPoolInfos support get devnet `rpc` pool info.
- new created pool needs couple minutes to sync data to api, if you want to get info immediately, use raydium.xxxx.getRpcPoolInfos instead.

#### create amm pool error

- `0x10001a9`: you might use https://openbook-tools.dexlab.space/market/create?network=devnet to create devnet market, and they used wrong devnet program id, so please use createMarket.ts in demo to create market
- `lp amount is too less`: please provide more base/quote amount when create pool, if there's SOL/WSOL in your market, it's better provide more than 4 sol(4\*10\*\*9) in initial amount.


create market

<!-- https://openbook-tools.dexlab.space/market/HYqNwtwYdMTVQUensqQ3njrDu1vucwYVCD7kXbifeMnJ?network=devnet -->


```bash
  yarn dev src/launchpad/createPlatform.ts
  yarn dev src/launchpad/createMint.ts
  connect to rpc https://devnet.helius-rpc.com/?api-key=cf609d92-4542-4de3-bde5-a5b25e2efbe2 in devnet
  simulate tx string: [
    'AQwHRnkzYiaifZaEtfaoRJXorURisBprt4CT8kGX/CFVQP2EsO+jIEnpoVnWwusyLRJuSdpzJAnqOYnhNLKmtAWAAQABAwCi37tFgA1cx8FXSaimh57E6I7Aeo7yzZN1A079pHtG6YqkggQGEdgTYMG9RjqgPV5EWmX4G+96K1BVHyzQytq4mJbg8CKCAdZjAz4NnpoxO0KbH0p3fXx1lRJ6qKa3cWtMK4dmWeS9EzYFBLUa3H3lNFlRQ0R8Q1pNPdzZjBmGAQIHAAAAAQMEAIQBsFrEr/1x3BSAGgYAAAAAACChBwAAAAAAoIYBAAAAAADoAwAAAAAAABIAAAB5b3VyIHBsYXRmb3JtIG5hbWUZAAAAaHR0cHM6Ly95b3VyLnBsYXRmb3JtLm9yZx0AAABodHRwczovL3lvdXIucGxhdGZvcm0ub3JnL2ltZwAAAAAAAAAAAcTrsmxH1X0mdqMX8KwrApwkEJMpr5lIg+vhgWoCNV5OARABFA=='
  ]
  {
    txId: 'EwzpvM9k1nJs8ibDscLZp7wWPHj7mxgED5LcPKDa4wasaAP7zsgYzGRPfyA5JhfH3a4mzB3Gd7SEMqjSsvmWpmA',
    signedTx: VersionedTransaction {
      signatures: [ [Uint8Array] ],
      message: MessageV0 {
        header: [Object],
        staticAccountKeys: [Array],
        recentBlockhash: '8DqzMQhAZPArXGqu64S4cjQhKNpoMhE7Sy7LjuQGuqdo',
        compiledInstructions: [Array],
        addressTableLookups: [Array]
      }
    }
  } platformId: GiecNPBAk5uGsHeqQJSHVu7yivSBjuL4xWJU6hBq8bn9
```

connect to rpc https://devnet.helius-rpc.com/?api-key=cf609d92-4542-4de3-bde5-a5b25e2efbe2 in devnet

simulate tx string: [
  'AgB4ph3gfKXDft3A8dRkOFvR5yrIIP8k4eB+NOfx7vHBhTFfu1m+xJZEbaMYs9YXVysS8rsSfuDMZ2caMlXmWw557NdZ3vB5/AXOwDJAynrBlLzkSgrK1BAMGdtZ3di9XuFODWh4C/iswL7H57rvwdft4dBJGd+np8+NNfeMYecBgAIAAwkAot+7RYANXMfBV0mopoeexOiOwHqO8s2TdQNO/aR7RpRY4Dctcy+u/j536K22a2p5L2rVo9og3NMZ93HyfqliWSWc05ODGbXeRQuWj0XkJhp4urI/q0diiPZJ4ducvxnLOgnJ8oHkw/kNSs+eiHpekhRvggk3pdXG0yyauuJiAzP4Y3yI1GCHvqt3ZmuGzHTwpvnUUftLUaR8KMh764HiuU6tDM3dbsP2wjL5YCBXyspdx9TuOXC77Lf6ZPoyV1i4mJbg8CKCAdZjAz4NnpoxO0KbH0p3fXx1lRJ6qKa3cemKpIIEBhHYE2DBvUY6oD1eRFpl+BvveitQVR8s0MraOe+i7eXTBlYDzxuRb+E3WM+7Jz6FxsT3qV6zMk5ar0MjiOttp/o0pR7cUcP3L2rBNrYsRdIhMiVdXLEZ7vHDLQEGEgAACQcKAgELAwQFDAwNDg8IBqcBQ5mvJ9oQJiAGEwAAAEpQRyBUb2tlbiBBTU0gOFhjQ0YJAAAASlBHLThYY0NGQwAAAGh0dHBzOi8vaXBmcy5pby9pcGZzL1FtZkhqemUyaGZpWGszeG56bndxZEhWUkdFM0hzU2FvUzJYTFBWdHVZa0FFamQAAIDGpH6NAwAAeMX7UdECAAASZcoTAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABxOuybEfVfSZ2oxfwrCsCnCQQkymvmUiD6+GBagI1Xk4AByUmHRUcFBk=',
  'ATgQWzhXnKMU/2YRClSAmhbK2zO5x5f4mmq/fL3t9dL563ucMf4vNygi5feCyPtvNelIwyrQbELhkzkuGAf4dAaAAQAIEQCi37tFgA1cx8FXSaimh57E6I7Aeo7yzZN1A079pHtGM19PRdLzWnJSy7bDqu+09qfCVJOHmAkcZ15Claq41swTxb8paQy2MrDZuAiozRCsm/UCmMmH3VGEIE7zoiZbHxJlbPrj5DIxvM5PrFGLzlM+tcN1kmtj4JoRPsCp/Pn8WSWc05ODGbXeRQuWj0XkJhp4urI/q0diiPZJ4ducvxnLOgnJ8oHkw/kNSs+eiHpekhRvggk3pdXG0yyauuJiAzP4Y3yI1GCHvqt3ZmuGzHTwpvnUUftLUaR8KMh764HijPfm8Edz6yt1ldz/LGRxCwXXPwG53fC8dAvm4xXuTfqiCrvkq4tzoR8JINlUzhiDEtar3DGAf7gMDweLJfLGkoyXJY9OJInxuz0QKRSODYMLWhOZ2v8QhASOe9jb6fhZlFjgNy1zL67+PnforbZrankvatWj2iDc0xn3cfJ+qWIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbd9uHXZaGT2cvhRs7reawctIXtX1s3kTqM9YV+/wCpOSFemju+9EZBsK/pQ5T8vQ1WieFX1Vi7NERbT5PgYwe4mJbg8CKCAdZjAz4NnpoxO0KbH0p3fXx1lRJ6qKa3cemKpIIEBhHYE2DBvUY6oD1eRFpl+BvveitQVR8s0MraOe+i7eXTBlYDzxuRb+E3WM+7Jz6FxsT3qV6zMk5ar0MjiOttp/o0pR7cUcP3L2rBNrYsRdIhMiVdXLEZ7vHDLQYJBgABAAoLDAEBCQYAAgARCwwBAQsCAAIMAgAAAOgDAAAAAAAADAECAREJBgADDRELDAEBDhMAEhMPBAECBQYKEQwMEA4DCwcIIPrqDXvVnBPs6AMAAAAAAAAwmBkCAAAAAOgDAAAAAAAAAcTrsmxH1X0mdqMX8KwrApwkEJMpr5lIg+vhgWoCNV5OAAMdJiU='
]
poolId:  {
  swapInfo: {
    amountA: {
      amount: <BN: 21f0655>,
      fee: undefined,
      expirationTime: undefined
    },
    amountB: <BN: 3e8>,
    splitFee: {
      platformFee: <BN: 1>,
      shareFee: <BN: 1>,
      protocolFee: <BN: 3>,
      creatorFee: <BN: 0>
    },
    decimalOutAmount: 35587669,
    minDecimalOutAmount: 35231792
  },
  address: {
    epoch: <BN: 380>,
    bump: 254,
    status: 0,
    mintDecimalsA: 6,
    mintDecimalsB: 9,
    supply: <BN: 38d7ea4c68000>,
    totalSellA: <BN: 2d151fbc57800>,
    mintA: PublicKey [PublicKey(Az5wcFeRZjbj5R1hqCAH9L8c2HiX5xGQGLdZrrAzTWdf)] {
      _bn: <BN: 9458e0372d732faefe3e77e8adb66b6a792f6ad5a3da20dcd319f771f27ea962>
    },
    mintB: PublicKey [PublicKey(So11111111111111111111111111111111111111112)] {
      _bn: <BN: 69b8857feab8184fb687f634618c035dac439dc1aeb3b5598a0f00000000001>
    },
    virtualA: <BN: 3cfe93e0e74de>,
    virtualB: <BN: 6fc30afd7>,
    realA: <BN: 0>,
    realB: <BN: 0>,
    migrateFee: <BN: 0>,
    migrateType: 0,
    protocolFee: <BN: 0>,
    platformFee: <BN: 3e8>,
    platformId: PublicKey [PublicKey(GiecNPBAk5uGsHeqQJSHVu7yivSBjuL4xWJU6hBq8bn9)] {
      _bn: <BN: e98aa482040611d81360c1bd463aa03d5e445a65f81bef7a2b50551f2cd0cada>
    },
    configId: PublicKey [PublicKey(7ZR4zD7PYfY2XxoG1Gxcy2EgEeGYrpxrwzPuwdUBssEt)] {
      _bn: <BN: 6173ec0b615bbfce432f28e52f020789644ce7b4fc4098517cf1a9c10c1c067d>
    },
    vaultA: PublicKey [PublicKey(EgK6LLxCFQsjFba1cawprsZ9N95zWerMrMdpMLV3EAdp)] {
      _bn: <BN: cb3a09c9f281e4c3f90d4acf9e887a5e92146f820937a5d5c6d32c9abae26203>
    },
    vaultB: PublicKey [PublicKey(4VsUBqjFrsbqaGwRKKpqECW1UsfWK9qv7oEXVgyN7VTF)] {
      _bn: <BN: 33f8637c88d46087beab77666b86cc74f0a6f9d451fb4b51a47c28c87beb81e2>
    },
    creator: PublicKey [PublicKey(13V3hb7Nof4WidQugyj7gTH3DxPJKchMP6faDi4xUZTT)] {
      _bn: <BN: a2dfbb45800d5cc7c15749a8a6879ec4e88ec07a8ef2cd9375034efda47b46>
    },
    totalFundRaisingB: <BN: 13ca651200>,
    vestingSchedule: {
      totalLockedAmount: <BN: 0>,
      cliffPeriod: <BN: 0>,
      unlockPeriod: <BN: 0>,
      startTime: <BN: 0>,
      totalAllocatedShare: <BN: 0>
    },
    mintProgramFlag: 0,
    cpmmCreatorFeeOn: 0,
    poolId: PublicKey [PublicKey(6zzYtnmhAGfn9LQJKvC6KwvUzPbPYzy17uiCzX1Ldwy2)] {
      _bn: <BN: 59259cd3938319b5de450b968f45e4261a78bab23fab476288f649e1db9cbf19>
    }
  }
}
{
  txIds: [
    '1YhSb38dCL7oz5TDfxGbPHjojCJ4Q18aMqNW6JL4VwjicTAEUQJP9C9JypmYwuZ9rPYiEr22XkZoNCVx6Cx6kd3',
    '281hQotRquDSQhLfmvDtiMQ5xURb9MFGYmPTzEiri6JaaxiqXzj47aaLrvNUZiCovMhmaiNiEhKFoJHseHdTBviR'
  ],
  signedTxs: [
    VersionedTransaction { signatures: [Array], message: [MessageV0] },
    VersionedTransaction { signatures: [Array], message: [MessageV0] }
  ]
}

connect to rpc https://devnet.helius-rpc.com/?api-key=cf609d92-4542-4de3-bde5-a5b25e2efbe2 in devnet
simulate tx string: [
  'AvOR4HdTX7hcN2wKkLZnjn7FxL9X2JgUZwozjFrCxlH8zVLLNUqrNBUz3NU6EWCKfD8POKfhzVbGAwJgjyILcQ5oSFZxWXAorLK4I25FycRnRLFfsYgx3i6M4oWF/uMeuMbAEl/OBm3Rojf3zO8LzrSYrAo3B15uiw+Rd5xlZkUFgAIAAwkAot+7RYANXMfBV0mopoeexOiOwHqO8s2TdQNO/aR7RoOUB1gfwphs/Bqxe5JKQ4X6M2ugNFOiSaNFM0MW2uk36zgmybLIiX9ORjoiWSe5pJnZvTKuRSSoDfc4f8ChK8M3CjzvDDilPAFehWXbfGlJ3WoUUImR0NkM9tGChIlKQUrpBiM5ogBYsbYHTeje3J0KlE6zJZX+B0KvezHlcSoxOWyBF91Wz87mRhhsPgzdnW0QgI6ULsafdtw39dSPpaq4mJbg8CKCAdZjAz4NnpoxO0KbH0p3fXx1lRJ6qKa3cemKpIIEBhHYE2DBvUY6oD1eRFpl+BvveitQVR8s0MraOe+i7eXTBlYDzxuRb+E3WM+7Jz6FxsT3qV6zMk5ar0NIcpCTl1QYXSEbzaEgSCpdqY4C9T4nQF/dA7vVPv0ZZgEGEgAACQcKAgELAwQFDAwNDg8IBqEBQ5mvJ9oQJiAGDgAAAEdlbmcxU29sIFRva2VuCAAAAEdlbmcxU29sQwAAAGh0dHBzOi8vaXBmcy5pby9pcGZzL1FtZkhqemUyaGZpWGszeG56bndxZEhWUkdFM0hzU2FvUzJYTFBWdHVZa0FFamQAAIDGpH6NAwAAeMX7UdECAAASZcoTAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABxOuybEfVfSZ2oxfwrCsCnCQQkymvmUiD6+GBagI1Xk4AByUmHRUcFBk=',
  'AYu3suyNv/c4XSSPmpGG1nEfjnKR8ZBXP2G4INWzRObyr7KPc/qVoYkgkb6xAfdvpDglft+K1xYZy43zYIrinQ6AAQAIEQCi37tFgA1cx8FXSaimh57E6I7Aeo7yzZN1A079pHtGG8xH+8hKb5DB0LsA++lGSetdAxM6MqIu9J2TDoPdk4QTxb8paQy2MrDZuAiozRCsm/UCmMmH3VGEIE7zoiZbHxJlbPrj5DIxvM5PrFGLzlM+tcN1kmtj4JoRPsCp/Pn86zgmybLIiX9ORjoiWSe5pJnZvTKuRSSoDfc4f8ChK8M3CjzvDDilPAFehWXbfGlJ3WoUUImR0NkM9tGChIlKQUrpBiM5ogBYsbYHTeje3J0KlE6zJZX+B0KvezHlcSoxjPfm8Edz6yt1ldz/LGRxCwXXPwG53fC8dAvm4xXuTfqiCrvkq4tzoR8JINlUzhiDEtar3DGAf7gMDweLJfLGkoyXJY9OJInxuz0QKRSODYMLWhOZ2v8QhASOe9jb6fhZg5QHWB/CmGz8GrF7kkpDhfoza6A0U6JJo0UzQxba6TcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbd9uHXZaGT2cvhRs7reawctIXtX1s3kTqM9YV+/wCpOSFemju+9EZBsK/pQ5T8vQ1WieFX1Vi7NERbT5PgYwe4mJbg8CKCAdZjAz4NnpoxO0KbH0p3fXx1lRJ6qKa3cemKpIIEBhHYE2DBvUY6oD1eRFpl+BvveitQVR8s0MraOe+i7eXTBlYDzxuRb+E3WM+7Jz6FxsT3qV6zMk5ar0NIcpCTl1QYXSEbzaEgSCpdqY4C9T4nQF/dA7vVPv0ZZgYJBgABAAoLDAEBCQYAAgARCwwBAQsCAAIMAgAAAOgDAAAAAAAADAECAREJBgADDRELDAEBDhMAEhMPBAECBQYKEQwMEA4DCwcIIPrqDXvVnBPs6AMAAAAAAAAwmBkCAAAAAOgDAAAAAAAAAcTrsmxH1X0mdqMX8KwrApwkEJMpr5lIg+vhgWoCNV5OAAMdJiU='
]
poolId:  {
  swapInfo: {
    amountA: {
      amount: <BN: 21f0655>,
      fee: undefined,
      expirationTime: undefined
    },
    amountB: <BN: 3e8>,
    splitFee: {
      platformFee: <BN: 1>,
      shareFee: <BN: 1>,
      protocolFee: <BN: 3>,
      creatorFee: <BN: 0>
    },
    decimalOutAmount: 35587669,
    minDecimalOutAmount: 35231792
  },
  address: {
    epoch: <BN: 380>,
    bump: 254,
    status: 0,
    mintDecimalsA: 6,
    mintDecimalsB: 9,
    supply: <BN: 38d7ea4c68000>,
    totalSellA: <BN: 2d151fbc57800>,
    mintA: PublicKey [PublicKey(9rdKtkft3jLnSRckYQDots3iKpa5ozbnXu9GwFXttEcE)] {
      _bn: <BN: 839407581fc2986cfc1ab17b924a4385fa336ba03453a249a345334316dae937>
    },
    mintB: PublicKey [PublicKey(So11111111111111111111111111111111111111112)] {
      _bn: <BN: 69b8857feab8184fb687f634618c035dac439dc1aeb3b5598a0f00000000001>
    },
    virtualA: <BN: 3cfe93e0e74de>,
    virtualB: <BN: 6fc30afd7>,
    realA: <BN: 0>,
    realB: <BN: 0>,
    migrateFee: <BN: 0>,
    migrateType: 0,
    protocolFee: <BN: 0>,
    platformFee: <BN: 3e8>,
    platformId: PublicKey [PublicKey(GiecNPBAk5uGsHeqQJSHVu7yivSBjuL4xWJU6hBq8bn9)] {
      _bn: <BN: e98aa482040611d81360c1bd463aa03d5e445a65f81bef7a2b50551f2cd0cada>
    },
    configId: PublicKey [PublicKey(7ZR4zD7PYfY2XxoG1Gxcy2EgEeGYrpxrwzPuwdUBssEt)] {
      _bn: <BN: 6173ec0b615bbfce432f28e52f020789644ce7b4fc4098517cf1a9c10c1c067d>
    },
    vaultA: PublicKey [PublicKey(4hrUin38ZRZKMxqh8uWk9W2wYE2caEhn8GTJqciHMwUC)] {
      _bn: <BN: 370a3cef0c38a53c015e8565db7c6949dd6a14508991d0d90cf6d18284894a41>
    },
    vaultB: PublicKey [PublicKey(63RFvHXx9XDhv2UBNpocS7RnZhUQ3M2vvqEMQrmudR44)] {
      _bn: <BN: 4ae9062339a20058b1b6074de8dedc9d0a944eb32595fe0742af7b31e5712a31>
    },
    creator: PublicKey [PublicKey(13V3hb7Nof4WidQugyj7gTH3DxPJKchMP6faDi4xUZTT)] {
      _bn: <BN: a2dfbb45800d5cc7c15749a8a6879ec4e88ec07a8ef2cd9375034efda47b46>
    },
    totalFundRaisingB: <BN: 13ca651200>,
    vestingSchedule: {
      totalLockedAmount: <BN: 0>,
      cliffPeriod: <BN: 0>,
      unlockPeriod: <BN: 0>,
      startTime: <BN: 0>,
      totalAllocatedShare: <BN: 0>
    },
    mintProgramFlag: 0,
    cpmmCreatorFeeOn: 0,
    poolId: PublicKey [PublicKey(GqCUEw2HCUEbtrRcJ6fGyK2S5Ra6PnsB6cqx8gcveC9p)] {
      _bn: <BN: eb3826c9b2c8897f4e463a225927b9a499d9bd32ae4524a80df7387fc0a12bc3>
    }
  }
}
{
  txIds: [
    '5sSovN4pnXkEFJgwVbHtMZK5zvMHJw7XM5nzW7ABvv9oR5nBk9QdfTtgPzVzKjTMLnNorWcC7hnHj8urxSYi75XK',
    '3o21DS2dEavpJe6dHitgjwBoJLstVS8zeW33nGEugC2V2Pp5HQexxSmqDyzuitK2KcrV8HU2kRCBmk6emSSzNk2H'
  ],
  signedTxs: [
    VersionedTransaction { signatures: [Array], message: [MessageV0] },
    VersionedTransaction { signatures: [Array], message: [MessageV0] }
  ]
}

connect to rpc https://devnet.helius-rpc.com/?api-key=cf609d92-4542-4de3-bde5-a5b25e2efbe2 in devnet
{ minFundRaisingB: '30000000000', totalFundRaisingB: '5000000000' }
simulate tx string: [
  'AthYKzgkTK3pYWuqPOcHJrFEms17nNoB0Z4/xlb0q7PUScvJLR/KCDIDCVFs6oUhkao2XODBGXnSiU2/jsa6hw6R1pPQNMNIXeVVLgYtYAhq4xqG9y+9Ncux2Ib2U+kj5IjB7xDBNc1MqtYb1cXcOWJdOw3rmyfmScexNLp7S4cMgAIAAwkAot+7RYANXMfBV0mopoeexOiOwHqO8s2TdQNO/aR7RkDKjySDt/OKFYynXP3mcJXERdBjQBtfyCD1jpDaafXPQ5OYBQBwd4SLJ67o3uQM9Eoc6QcpPJY3u/+jZMQ7zA3IY1uJKVD4v1h2Hz0nLKQtHplsUiL7gBYTaj5YIQMQe0oTeI0DiwMw6la23MBpUOb90xFStA8wyFKZ0EDoj0vOak4eyeFOlSr7YwLDNm5CsQMpOqzW/sJQDeKbFz8GORW4mJbg8CKCAdZjAz4NnpoxO0KbH0p3fXx1lRJ6qKa3cemKpIIEBhHYE2DBvUY6oD1eRFpl+BvveitQVR8s0MraOe+i7eXTBlYDzxuRb+E3WM+7Jz6FxsT3qV6zMk5ar0MwTM4yG3x//wuCqPAKQuh9THxwNhfuaCxWQOnCpCoZXwEGEgAACQcKAgELAwQFDAwNDg8IBqEBQ5mvJ9oQJiAGDgAAAEdlbmcxU29sIFRva2VuCAAAAEdlbmcxU29sQwAAAGh0dHBzOi8vaXBmcy5pby9pcGZzL1FtZkhqemUyaGZpWGszeG56bndxZEhWUkdFM0hzU2FvUzJYTFBWdHVZa0FFamQAAIDGpH6NAwAAeMX7UdECAACsI/wGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABxOuybEfVfSZ2oxfwrCsCnCQQkymvmUiD6+GBagI1Xk4AByUmHRUcFBk=',
  'ARxuhjhHTlEMTaUOtVGe9LvhfTcBB3PQpptP9t7xGZQOU51imf9qq3o5GsGXyFRLHLLrTk/eG6QDjwOUaaX/eQuAAQAIEQCi37tFgA1cx8FXSaimh57E6I7Aeo7yzZN1A079pHtGVUSfObvFL2aX8H0XEbGizBH2a6xmWUL41rZ3Yns87WsTxb8paQy2MrDZuAiozRCsm/UCmMmH3VGEIE7zoiZbHxJlbPrj5DIxvM5PrFGLzlM+tcN1kmtj4JoRPsCp/Pn8Q5OYBQBwd4SLJ67o3uQM9Eoc6QcpPJY3u/+jZMQ7zA3IY1uJKVD4v1h2Hz0nLKQtHplsUiL7gBYTaj5YIQMQe0oTeI0DiwMw6la23MBpUOb90xFStA8wyFKZ0EDoj0vOjPfm8Edz6yt1ldz/LGRxCwXXPwG53fC8dAvm4xXuTfqiCrvkq4tzoR8JINlUzhiDEtar3DGAf7gMDweLJfLGkoyXJY9OJInxuz0QKRSODYMLWhOZ2v8QhASOe9jb6fhZQMqPJIO384oVjKdc/eZwlcRF0GNAG1/IIPWOkNpp9c8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbd9uHXZaGT2cvhRs7reawctIXtX1s3kTqM9YV+/wCpOSFemju+9EZBsK/pQ5T8vQ1WieFX1Vi7NERbT5PgYwe4mJbg8CKCAdZjAz4NnpoxO0KbH0p3fXx1lRJ6qKa3cemKpIIEBhHYE2DBvUY6oD1eRFpl+BvveitQVR8s0MraOe+i7eXTBlYDzxuRb+E3WM+7Jz6FxsT3qV6zMk5ar0MwTM4yG3x//wuCqPAKQuh9THxwNhfuaCxWQOnCpCoZXwYJBgABAAoLDAEBCQYAAgARCwwBAQsCAAIMAgAAAOgDAAAAAAAADAECAREJBgADDRELDAEBDhMAEhMPBAECBQYKEQwMEA4DCwcIIPrqDXvVnBPs6AMAAAAAAAAvL/MFAAAAAOgDAAAAAAAAAcTrsmxH1X0mdqMX8KwrApwkEJMpr5lIg+vhgWoCNV5OAAMdJiU='
]
poolId:  {
  swapInfo: {
    amountA: {
      amount: <BN: 60291ec>,
      fee: undefined,
      expirationTime: undefined
    },
    amountB: <BN: 3e8>,
    splitFee: {
      platformFee: <BN: 1>,
      shareFee: <BN: 1>,
      protocolFee: <BN: 3>,
      creatorFee: <BN: 0>
    },
    decimalOutAmount: 100831724,
    minDecimalOutAmount: 99823407
  },
  address: {
    epoch: <BN: 380>,
    bump: 254,
    status: 0,
    mintDecimalsA: 6,
    mintDecimalsB: 9,
    supply: <BN: 38d7ea4c68000>,
    totalSellA: <BN: 2d151fbc57800>,
    mintA: PublicKey [PublicKey(5MvEkFtY2MzSvF3D8wt8V9qwhg36vnP3QQ5JREM981sc)] {
      _bn: <BN: 40ca8f2483b7f38a158ca75cfde67095c445d063401b5fc820f58e90da69f5cf>
    },
    mintB: PublicKey [PublicKey(So11111111111111111111111111111111111111112)] {
      _bn: <BN: 69b8857feab8184fb687f634618c035dac439dc1aeb3b5598a0f00000000001>
    },
    virtualA: <BN: 3cfe93e0e8efa>,
    virtualB: <BN: 277203e0f>,
    realA: <BN: 0>,
    realB: <BN: 0>,
    migrateFee: <BN: 0>,
    migrateType: 0,
    protocolFee: <BN: 0>,
    platformFee: <BN: 3e8>,
    platformId: PublicKey [PublicKey(GiecNPBAk5uGsHeqQJSHVu7yivSBjuL4xWJU6hBq8bn9)] {
      _bn: <BN: e98aa482040611d81360c1bd463aa03d5e445a65f81bef7a2b50551f2cd0cada>
    },
    configId: PublicKey [PublicKey(7ZR4zD7PYfY2XxoG1Gxcy2EgEeGYrpxrwzPuwdUBssEt)] {
      _bn: <BN: 6173ec0b615bbfce432f28e52f020789644ce7b4fc4098517cf1a9c10c1c067d>
    },
    vaultA: PublicKey [PublicKey(EVEQtaQdU1UeASVKbr6YXfaxjupRuRsTn5eE28Q8Jyke)] {
      _bn: <BN: c8635b892950f8bf58761f3d272ca42d1e996c5222fb8016136a3e582103107b>
    },
    vaultB: PublicKey [PublicKey(5zAPcHNBhpMQMqzzfxufJ4rSniEE9ybome8fgo32kUE9)] {
      _bn: <BN: 4a13788d038b0330ea56b6dcc06950e6fdd31152b40f30c85299d040e88f4bce>
    },
    creator: PublicKey [PublicKey(13V3hb7Nof4WidQugyj7gTH3DxPJKchMP6faDi4xUZTT)] {
      _bn: <BN: a2dfbb45800d5cc7c15749a8a6879ec4e88ec07a8ef2cd9375034efda47b46>
    },
    totalFundRaisingB: <BN: 6fc23ac00>,
    vestingSchedule: {
      totalLockedAmount: <BN: 0>,
      cliffPeriod: <BN: 0>,
      unlockPeriod: <BN: 0>,
      startTime: <BN: 0>,
      totalAllocatedShare: <BN: 0>
    },
    mintProgramFlag: 0,
    cpmmCreatorFeeOn: 0,
    poolId: PublicKey [PublicKey(5YnrDHHGrHBzviLGXgGPTovywLyjaguWPzDDSwXN3xkt)] {
      _bn: <BN: 43939805007077848b27aee8dee40cf44a1ce907293c9637bbffa364c43bcc0d>
    }
  }
}
{
  txIds: [
    '5KshtxV2dKVzxJs8KxshYYDBJdkfwxPr9xY9wcavftq74L7N6ceQQwFHH1bAwr23dH5Ek5xyGj9XYWouKRuaSomf',
    'ZyEkVn288wQc6gtRVWRtZgHdbBm4sd4UvnfvNdAZQfh4S9wtr54UmpvFGGfwDMAERZE4DHjvUA9V4uT9kLQXMsg'
  ],
  signedTxs: [
    VersionedTransaction { signatures: [Array], message: [MessageV0] },
    VersionedTransaction { signatures: [Array], message: [MessageV0] }
  ]
}