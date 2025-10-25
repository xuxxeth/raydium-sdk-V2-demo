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

```bash
yarn dev src/launchpad/createMint.ts                                                                          
connect to rpc https://mainnet.helius-rpc.com/?api-key=cf609d92-4542-4de3-bde5-a5b25e2efbe2 in mainnet
simulate tx string: [
  'ApyxO/lm/hvyEaub4yKd/0ikFDXD+3/de6yjtxCQ4Lt9kdtyQILo580y0qD5VDcWZolBvzI8NEpJ6Em4Vdv10Q4x+ZSxhKR5CllbXg40/n/E+ytYKvQds4z9Bw1JjfkIFo9tJrl/VLTUuI5o9HWQSA5H52cirH5M/3+YHyqexwcIgAIAAwkAot+7RYANXMfBV0mopoeexOiOwHqO8s2TdQNO/aR7RuICMnpDodM23dJHcXkeCioE4hjnTtbz3c7L/wqnVR9F6/5pmyzgRAtVjuqyLQPbNG+wVv4dzk9q9q1Kqgeb4ZFvwJtMoQi6he10gy/IZFnXGd+Y38wWFFEZD09ekLptnKCzvznJgJ1reHY+YT5mRyWO62Tytyz15JQjSSoRGxyEuuPqL5eOywNFEf6tMitU/nehBXp1z3KJdd7PfesvnnAFBDuVTcom4e+RtSxPj4mvim9ayMYhVvFxzw8hrFHJIi9d0sInkkvndn/2vV6J0nqFwFOrtm6IZxHmuu/FhbhLEge5mzXd4o5Lnt7pfknXY5e1pKDJP6/SdMeGoAaO3W/6U+SMGqWFx1J58QBc8me8a2kqytRhelseXLJbIjydTQEGEgAACQcKAgELAwQFDAwNDg8IBmdDma8n2hAmIAYLAAAAR2VuZyDmopfnvZEEAAAAR2VuZxAAAABodHRwczovL2dlbmcub25lAACAxqR+jQMAAHjF+1HRAgAAEmXKEwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY7GAPKcxZ5a2LfuEsI8xzt6W4kUYkbN8PC/gGOt8xJ1AAdCQUABCAAF'
]
simulate tx string: [
  'ApyxO/lm/hvyEaub4yKd/0ikFDXD+3/de6yjtxCQ4Lt9kdtyQILo580y0qD5VDcWZolBvzI8NEpJ6Em4Vdv10Q4x+ZSxhKR5CllbXg40/n/E+ytYKvQds4z9Bw1JjfkIFo9tJrl/VLTUuI5o9HWQSA5H52cirH5M/3+YHyqexwcIgAIAAwkAot+7RYANXMfBV0mopoeexOiOwHqO8s2TdQNO/aR7RuICMnpDodM23dJHcXkeCioE4hjnTtbz3c7L/wqnVR9F6/5pmyzgRAtVjuqyLQPbNG+wVv4dzk9q9q1Kqgeb4ZFvwJtMoQi6he10gy/IZFnXGd+Y38wWFFEZD09ekLptnKCzvznJgJ1reHY+YT5mRyWO62Tytyz15JQjSSoRGxyEuuPqL5eOywNFEf6tMitU/nehBXp1z3KJdd7PfesvnnAFBDuVTcom4e+RtSxPj4mvim9ayMYhVvFxzw8hrFHJIi9d0sInkkvndn/2vV6J0nqFwFOrtm6IZxHmuu/FhbhLEge5mzXd4o5Lnt7pfknXY5e1pKDJP6/SdMeGoAaO3W/6U+SMGqWFx1J58QBc8me8a2kqytRhelseXLJbIjydTQEGEgAACQcKAgELAwQFDAwNDg8IBmdDma8n2hAmIAYLAAAAR2VuZyDmopfnvZEEAAAAR2VuZxAAAABodHRwczovL2dlbmcub25lAACAxqR+jQMAAHjF+1HRAgAAEmXKEwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY7GAPKcxZ5a2LfuEsI8xzt6W4kUYkbN8PC/gGOt8xJ1AAdCQUABCAAF'
]
poolId:  {
  swapInfo: {
    amountA: { amount: <BN: 0>, fee: undefined, expirationTime: undefined },
    amountB: <BN: 0>,
    splitFee: {
      platformFee: <BN: 0>,
      shareFee: <BN: 0>,
      protocolFee: <BN: 0>,
      creatorFee: <BN: 0>
    }
  },
  address: {
    epoch: <BN: 380>,
    bump: 254,
    status: 0,
    mintDecimalsA: 6,
    mintDecimalsB: 9,
    supply: <BN: 38d7ea4c68000>,
    totalSellA: <BN: 2d151fbc57800>,
    mintA: PublicKey [PublicKey(GDF5oqje86oNioRBeaKp8mZg1xfZLfUawyuWgFQPCnip)] {
      _bn: <BN: e202327a43a1d336ddd24771791e0a2a04e218e74ed6f3ddcecbff0aa7551f45>
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
    platformFee: <BN: 1d4c>,
    platformId: PublicKey [PublicKey(4Bu96XjU84XjPDSpveTVf6LYGCkfW5FK7SNkREWcEfV4)] {
      _bn: <BN: 2f5dd2c227924be7767ff6bd5e89d27a85c053abb66e886711e6baefc585b84b>
    },
    configId: PublicKey [PublicKey(6s1xP3hpbAfFoNtUNF8mfHsjr2Bd97JxFJRWLbL6aHuX)] {
      _bn: <BN: 571a8e01c8df7820f9d66b3c7365b8d1e4afa81b7854cc2ef75cef58bd08867e>
    },
    vaultA: PublicKey [PublicKey(8XEbcRrVEnvJjtxKgvAFX8HtLP8tzLPbVH9SorAWAJYT)] {
      _bn: <BN: 6fc09b4ca108ba85ed74832fc86459d719df98dfcc161451190f4f5e90ba6d9c>
    },
    vaultB: PublicKey [PublicKey(BpKCeRE79Das2a85NMsoifv47jjt1xabTMsuD2jyg6pK)] {
      _bn: <BN: a0b3bf39c9809d6b78763e613e6647258eeb64f2b72cf5e49423492a111b1c84>
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
    poolId: PublicKey [PublicKey(GtDp8vVn5Bk6pKN9fnfmEdu7s2YnRvZ67226Qyiy83t4)] {
      _bn: <BN: ebfe699b2ce0440b558eeab22d03db346fb056fe1dce4f6af6ad4aaa079be191>
    }
  }
}
{
  txIds: [
    '48hgEzak8sEw4ULvJsj5YrsD1DurjJgU4tMQhXUYs5Xc8uaMvDvvj9XdaQP8j3HwrbrN2rBaUcZ2wePjEVjDF1dw'
  ],
  signedTxs: [
    VersionedTransaction { signatures: [Array], message: [MessageV0] }
  ]
}
```


connect to rpc https://mainnet.helius-rpc.com/?api-key=cf609d92-4542-4de3-bde5-a5b25e2efbe2 in mainnet
simulate tx string: [
  'AgsIZj5Tu8ha6xbRQSbAIVde4BaOuZF6aHuq3jAqBB9jJjhIoVi6fVw6VLab+yKWO2jwbpkQjE/UfVRa80QEnQlNou4cTXrEA7fNX5rvLA/uoWKAia9njBR34w+DWBI8CPMtcEztKiUs5+LKmNvnYmDJSD4kFeHP2b6mpZj8WKYBgAIABxIAot+7RYANXMfBV0mopoeexOiOwHqO8s2TdQNO/aR7Rl47WNRYVmIC+F2XSaExbmXVstmJyq80SvG6xdffTrgcI9ch+Zex3QcXEEzxnnOKfkmJb4QuwO5U4GK5814V50kbE78DKQTqUGKfsicWNA19VPRed/b+ZJM2UbBV4eycRCrSx1exoo6JURFbgmdtfNk/qknCEWE2Ltp03L3AFhEdNklbSfP5stvkqPuTsHylOBU8cAxQEA7TU01YbgDJK7wmbVKvihhyvegOLg4WpPfI9J6Foi3/FCa2uQEXYDuJJRPFvylpDLYysNm4CKjNEKyb9QKYyYfdUYQgTvOiJlsfEmVs+uPkMjG8zk+sUYvOUz61w3WSa2PgmhE+wKn8+fzHIsrQOGKwUnUeoW+TiKPCYU80ScHMe7UQuW+mBTbIOy7tNhjEKZkajxi29xWNGy+fgciCWdWbnQkkufZp7HscBQQ7lU3KJuHvkbUsT4+Jr4pvWsjGIVbxcc8PIaxRySIvXdLCJ5JL53Z/9r1eidJ6hcBTq7ZuiGcR5rrvxYW4Swbd9uHXZaGT2cvhRs7reawctIXtX1s3kTqM9YV+/wCpAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASB7mbNd3ijkue3ul+Sddjl7WkoMk/r9J0x4agBo7db4yXJY9OJInxuz0QKRSODYMLWhOZ2v8QhASOe9jb6fhZOSFemju+9EZBsK/pQ5T8vQ1WieFX1Vi7NERbT5PgYwf64ZR3mWaqoZ7YkFSMHv6alV7lvDlVze7eSdJoaZwXsQcLEgAAEgwTAgEUAwQFDQ0VDhYPC58BQ5mvJ9oQJiAGDQAAAEpQRyBUb2tlbiBBTU0HAAAASlBHLUFNTUMAAABodHRwczovL2lwZnMuaW8vaXBmcy9RbWZIanplMmhmaVhrM3huem53cWRIVlJHRTNIc1Nhb1MyWExQVnR1WWtBRWpkAACAxqR+jQMAAHjF+1HRAgAAEmXKEwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAYABgABDg0BARAGAAcAFA4NAQEOAgAHDAIAAADoAwAAAAAAAA0BBwEREAYACBEUDg0BAQsTABMSDAIGBwMEARQNDQ8LCA4JCiD66g171ZwT7OgDAAAAAAAA+88VAgAAAADoAwAAAAAAAAGOxgDynMWeWti37hLCPMc7eluJFGJGzfDwv4BjrfMSdQAFQkFACAU='
]
simulate tx string: [
  'AgsIZj5Tu8ha6xbRQSbAIVde4BaOuZF6aHuq3jAqBB9jJjhIoVi6fVw6VLab+yKWO2jwbpkQjE/UfVRa80QEnQlNou4cTXrEA7fNX5rvLA/uoWKAia9njBR34w+DWBI8CPMtcEztKiUs5+LKmNvnYmDJSD4kFeHP2b6mpZj8WKYBgAIABxIAot+7RYANXMfBV0mopoeexOiOwHqO8s2TdQNO/aR7Rl47WNRYVmIC+F2XSaExbmXVstmJyq80SvG6xdffTrgcI9ch+Zex3QcXEEzxnnOKfkmJb4QuwO5U4GK5814V50kbE78DKQTqUGKfsicWNA19VPRed/b+ZJM2UbBV4eycRCrSx1exoo6JURFbgmdtfNk/qknCEWE2Ltp03L3AFhEdNklbSfP5stvkqPuTsHylOBU8cAxQEA7TU01YbgDJK7wmbVKvihhyvegOLg4WpPfI9J6Foi3/FCa2uQEXYDuJJRPFvylpDLYysNm4CKjNEKyb9QKYyYfdUYQgTvOiJlsfEmVs+uPkMjG8zk+sUYvOUz61w3WSa2PgmhE+wKn8+fzHIsrQOGKwUnUeoW+TiKPCYU80ScHMe7UQuW+mBTbIOy7tNhjEKZkajxi29xWNGy+fgciCWdWbnQkkufZp7HscBQQ7lU3KJuHvkbUsT4+Jr4pvWsjGIVbxcc8PIaxRySIvXdLCJ5JL53Z/9r1eidJ6hcBTq7ZuiGcR5rrvxYW4Swbd9uHXZaGT2cvhRs7reawctIXtX1s3kTqM9YV+/wCpAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASB7mbNd3ijkue3ul+Sddjl7WkoMk/r9J0x4agBo7db4yXJY9OJInxuz0QKRSODYMLWhOZ2v8QhASOe9jb6fhZOSFemju+9EZBsK/pQ5T8vQ1WieFX1Vi7NERbT5PgYwf64ZR3mWaqoZ7YkFSMHv6alV7lvDlVze7eSdJoaZwXsQcLEgAAEgwTAgEUAwQFDQ0VDhYPC58BQ5mvJ9oQJiAGDQAAAEpQRyBUb2tlbiBBTU0HAAAASlBHLUFNTUMAAABodHRwczovL2lwZnMuaW8vaXBmcy9RbWZIanplMmhmaVhrM3huem53cWRIVlJHRTNIc1Nhb1MyWExQVnR1WWtBRWpkAACAxqR+jQMAAHjF+1HRAgAAEmXKEwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAYABgABDg0BARAGAAcAFA4NAQEOAgAHDAIAAADoAwAAAAAAAA0BBwEREAYACBEUDg0BAQsTABMSDAIGBwMEARQNDQ8LCA4JCiD66g171ZwT7OgDAAAAAAAA+88VAgAAAADoAwAAAAAAAAGOxgDynMWeWti37hLCPMc7eluJFGJGzfDwv4BjrfMSdQAFQkFACAU='
]
poolId:  {
  swapInfo: {
    amountA: {
      amount: <BN: 21b3458>,
      fee: undefined,
      expirationTime: undefined
    },
    amountB: <BN: 3e8>,
    splitFee: {
      platformFee: <BN: 7>,
      shareFee: <BN: 1>,
      protocolFee: <BN: 4>,
      creatorFee: <BN: 0>
    },
    decimalOutAmount: 35337304,
    minDecimalOutAmount: 34983931
  },
  address: {
    epoch: <BN: 380>,
    bump: 254,
    status: 0,
    mintDecimalsA: 6,
    mintDecimalsB: 9,
    supply: <BN: 38d7ea4c68000>,
    totalSellA: <BN: 2d151fbc57800>,
    mintA: PublicKey [PublicKey(7Lqp15cf6iny2C3FZy6S3fRgyBq35ScYRRjUkFMmAMxo)] {
      _bn: <BN: 5e3b58d458566202f85d9749a1316e65d5b2d989caaf344af1bac5d7df4eb81c>
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
    platformFee: <BN: 1d4c>,
    platformId: PublicKey [PublicKey(4Bu96XjU84XjPDSpveTVf6LYGCkfW5FK7SNkREWcEfV4)] {
      _bn: <BN: 2f5dd2c227924be7767ff6bd5e89d27a85c053abb66e886711e6baefc585b84b>
    },
    configId: PublicKey [PublicKey(6s1xP3hpbAfFoNtUNF8mfHsjr2Bd97JxFJRWLbL6aHuX)] {
      _bn: <BN: 571a8e01c8df7820f9d66b3c7365b8d1e4afa81b7854cc2ef75cef58bd08867e>
    },
    vaultA: PublicKey [PublicKey(2phULtBhx8ppNKnTwdW2TMz79Z2NYc2pS94iDqbfgA6f)] {
      _bn: <BN: 1b13bf032904ea50629fb22716340d7d54f45e77f6fe64933651b055e1ec9c44>
    },
    vaultB: PublicKey [PublicKey(3tAY9c6AGLwzgDAt8EcMuYR8kPMndSq3pw2NgyFWeMBr)] {
      _bn: <BN: 2ad2c757b1a28e8951115b82676d7cd93faa49c21161362eda74dcbdc016111d>
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
    poolId: PublicKey [PublicKey(3QuXxzQ4KNpEaZLAUmQRxtDWpVNLxipdkTCPrKoWNfma)] {
      _bn: <BN: 23d721f997b1dd0717104cf19e738a7e49896f842ec0ee54e062b9f35e15e749>
    }
  }
}
{
  txIds: [
    'Do33QE1qPgpk1vq9DvwfvaGE4Hh8AzS2XwnQ5FM6HKyoxKDnvCvuFiGq3xWb7n3DaRtWUMY8MdvWcdLdemVNhMS'
  ],
  signedTxs: [
    VersionedTransaction { signatures: [Array], message: [MessageV0] }
  ]
}