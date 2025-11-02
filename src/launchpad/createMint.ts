import {
  TxVersion,
  DEVNET_PROGRAM_ID,
  printSimulate,
  getPdaLaunchpadConfigId,
  LaunchpadConfig,
  LAUNCHPAD_PROGRAM,
  LaunchpadPoolInitParam,
  getCpmmPdaAmmConfigId,
  CpmmCreatorFeeOn,
} from '@raydium-io/raydium-sdk-v2'
import { initSdk, owner } from '../config'
import BN from 'bn.js'
import { Keypair, PublicKey } from '@solana/web3.js'
import { NATIVE_MINT } from '@solana/spl-token'
import { generateSpecificKeypair } from './utils'

export const createMint = async () => {
  const raydium = await initSdk()

  const programId = DEVNET_PROGRAM_ID.LAUNCHPAD_PROGRAM // devnet: DEVNET_PROGRAM_ID.LAUNCHPAD_PROGRAM
  
  const pair = Keypair.generate()
  // const pair = generateSpecificKeypair() // generate xxxxend mint address
  const mintA = pair.publicKey

  const configId = getPdaLaunchpadConfigId(programId, NATIVE_MINT, 0, 0).publicKey

  const configData = await raydium.connection.getAccountInfo(configId)
  if (!configData) throw new Error('config not found')
  const configInfo = LaunchpadConfig.decode(configData.data)
  const mintBInfo = await raydium.token.getTokenInfo(configInfo.mintB)
  const inAmount = new BN(1300000000) // amount of mintB to buy launchpad mintA 2sol

  // Rayidum UI usage: https://github.com/raydium-io/raydium-ui-v3-public/blob/master/src/store/useLaunchpadStore.ts#L329
  const { execute, transactions, extInfo } = await raydium.launchpad.createLaunchpad({
    programId,
    mintA,
    decimals: 6,
    name: 'GengD Token',
    symbol: 'GengD',
    migrateType: 'cpmm',
    uri: 'https://ipfs.io/ipfs/QmfHjze2hfiXk3xnznwqdHVRGE3HsSaoS2XLPVtuYkAEjd',

    configId,
    configInfo, // optional, sdk will get data by configId if not provided
    mintBDecimals: mintBInfo.decimals, // default 9
    /** default platformId is Raydium platform, you can create your platform config in ./createPlatform.ts script */

    platformId: new PublicKey('E6uQXebFeCbS1byjC6sB3HTSscf9VQUs4vX5ciX4BLXu'), // default RAYDIUM playform 4Bu96XjU84XjPDSpveTVf6LYGCkfW5FK7SNkREWcEfV4
    txVersion: TxVersion.V0,
    slippage: new BN(100), // means 1%
    buyAmount: inAmount,
    createOnly: false, // true means create mint only, false will "create and buy together"
    extraSigners: [pair],

    creatorFeeOn: CpmmCreatorFeeOn.OnlyTokenB, //optional: default CpmmCreatorFeeOn.OnlyTokenB
    supply: new BN(1_000_000_000_000_000), // lauchpad mint supply amount, default: LaunchpadPoolInitParam.supply
    // totalSellA: new BN(793_100_000_000_000),  // lauchpad mint sell amount, default: LaunchpadPoolInitParam.totalSellA
    totalFundRaisingB: new BN(30_000_000_000),  // if mintB = SOL, means 85 SOL, default: LaunchpadPoolInitParam.totalFundRaisingB
    // totalLockedAmount: new BN(0),  // total locked amount, default 0
    // cliffPeriod: new BN(0),  // unit: seconds, default 0
    // unlockPeriod: new BN(0),  // unit: seconds, default 0

    // shareFeeReceiver: owner.publicKey, // only works when createOnly=false
    // shareFeeRate: new BN(3000), // only works when createOnly=false 0.3%
    platformFeeRate: new BN(2000), // optional: default 0, means 0%, unit is bps*100, e.g. 1% = 1000
    // computeBudgetConfig: {
    //   units: 600000,
    //   microLamports: 46591500,
    // },
  })

  // printSimulate(transactions)

  try {
    const sentInfo = await execute({ sequentially: true })
    console.log('poolId: ', extInfo)
    console.log(sentInfo)
  } catch (e: any) {
    console.log(e)
  }

  process.exit() // if you don't want to end up node execution, comment this line
}

/** uncomment code below to execute */
createMint()

// X5Zo4iBA.MA6nu3NNy1T4uiI41Ph27RfHH0WRNPqh