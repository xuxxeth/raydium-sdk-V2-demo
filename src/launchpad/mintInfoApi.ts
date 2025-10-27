import axios from 'axios'
import { MintInfo } from './type'
import { MINT_INFO_URL } from './url'

async function mintInfoApi() {
  const mintList = ['J6bJdFiqcH17Yg1CWMrs57VSLizqPaboinG6cf5Yvgir']
  const r = await axios.get<{
    id: string
    success: boolean
    msg?: string
    data: {
      rows: MintInfo[]
    }
  }>(`${MINT_INFO_URL}?ids=${mintList.join(',')}`)

  console.log(r.data.data)

  process.exit()
}
mintInfoApi()
