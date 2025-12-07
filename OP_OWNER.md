
# Owner op

## 安装依赖包
在raydium-sdk-V2-geng目录下
`
 yarn 
`
## 创建平台ID

### 1. 更新配置文件到主网 src/env.ts
```
const privateKey = '15hdJof871Xc2q8hwZ6wzEPc2MVaMq7MeXS6NKnjfZDTQ6rbnWkgCN9zhQdiEbHZufzmYosqzcwDxzJvjNxNmtM' // platform5 owner keypair
const grpcUrl = 'https://mainnet.helius-rpc.com/?api-key=cf609d92-4542-4de3-bde5-a5b25e2efbe2'

export const GRPC_URL = grpcUrl
export const PRIVATE_KEY = privateKey
```

### 2. 执行创建操作
确认平台配置的正确性，在 **src/launchpad/createPlatform.ts**
```
  {
    programId: programId,
    platformAdmin: owner,
    platformClaimFeeWallet: owner,
    platformLockNftWallet: owner,
    cpConfigId: new PublicKey('5MxLgy9oPdTC3YgkiePHqr3EoCRD9uLVYRQS2ANAs7wy'),

    transferFeeExtensionAuth: owner, // or just set owner
    
    /**
     * when migration, launchpad pool will deposit mints in vaultA/vaultB to new cpmm pool
     * and return lp to migration wallet
     * migrateCpLockNftScale config is to set up usage of these lp
     * note: sum of these 3 should be 10**6, means percent (0%~100%)
     */
    migrateCpLockNftScale: {
      platformScale: new BN(400000), // means 40%, locked 40% of return lp and return to platform nft wallet
      creatorScale: new BN(500000), // means 50%, locked 50% of return lp and return to creator nft wallet
      burnScale: new BN(100000), // means 10%, burned return lp percent after migration
    },
    feeRate: new BN(10000), // 1% launch lab buy and sell platform feeRate
    creatorFeeRate: new BN(2500), // 支付给代币创建者的费用以bps*100为单位。例如：0.25% = 2500。最高为5,000。
    name: 'GENG',
    web: 'https://geng.one',
    img: 'https://geng.one/assets/images/v2/logo.png',
    txVersion: TxVersion.V0,
    computeBudgetConfig: {
      units: 600000,
      microLamports: 600000,
    },
  }
```

命令行工具执行
`
  yarn dev src/launchpad/createPlatform.ts  
`

## 提取平台手续费
确认平台Id配置正确，在文件 **src/launchpad/claimPlatformFeeFromVault.ts**，配置如下
```
  {
    programId: LAUNCHPAD_PROGRAM, // devnet: DEVNET_PROGRAM_ID.LAUNCHPAD_PROGRAM
    platformId: new PublicKey('G3TKsBMZQ7oSkys4t8unpLUD4AKCLUdGJNrisrfCtgKD'),
    claimFeeWallet: raydium.ownerPubKey,

    mintB: NATIVE_MINT, // currently all mintB is WSOL
    // mintBProgram?: TOKEN_PROGRAM_ID;

    txVersion: TxVersion.V0,
    // computeBudgetConfig: {
    //   units: 600000,
    //   microLamports: 600000,
    // },
  }
```


`
  yarn dev src/launchpad/claimPlatformFeeFromVault.ts
`