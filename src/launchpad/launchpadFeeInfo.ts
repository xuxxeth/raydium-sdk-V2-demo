import { initSdk } from '../config'
import { PublicKey } from '@solana/web3.js'

async function getLaunchpadFeeInfo() {
  const raydium = await initSdk()
  const poolId = new PublicKey('FrRkz7k5iRvBvyZNDCExdwnUwj67tHU9yBGgar9EoRw5')

  // 获取 Launchpad Pool 信息
  const poolInfo = await raydium.launchpad.getRpcPoolInfo({ poolId })

  console.log('=== Launchpad Pool Info ===')
  console.log(poolInfo)
  // console.log('状态:', poolInfo.is_completed ? '已完成 ✅' : '进行中 ⏳')
  // console.log('总销售额度:', poolInfo.totalFundRaisingB.toString())
  // console.log('当前已筹集:', poolInfo.totalRaisedB.toString())

  // // 查询平台与创作者收益 PDA 地址
  // const platformFeeVault = poolInfo.platformFeeVault
  // const creatorFeeVault = poolInfo.creatorFeeVault

  // console.log('Platform Fee Vault:', platformFeeVault.toBase58())
  // console.log('Creator Fee Vault:', creatorFeeVault.toBase58())

  // // 查询这两个 PDA 的余额（单位：Lamports）
  // const platformBalance = await raydium.connection.getBalance(platformFeeVault)
  // const creatorBalance = await raydium.connection.getBalance(creatorFeeVault)

  // console.log('平台收益 (Lamports):', platformBalance)
  // console.log('创作者收益 (Lamports):', creatorBalance)

  // console.log('平台收益 (SOL):', platformBalance / 1e9)
  // console.log('创作者收益 (SOL):', creatorBalance / 1e9)
}

getLaunchpadFeeInfo()
