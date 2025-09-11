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