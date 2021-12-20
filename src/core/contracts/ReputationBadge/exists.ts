import { OAuthProvider } from "@interrep/reputation"
import { ContractName } from "src/config"
import getBackendContractInstance from "src/utils/backend/getBackendContractInstance"
import getContractAddress from "src/utils/common/getContractAddress"

export default async function exists(tokenId: string, provider: OAuthProvider): Promise<boolean> {
    const contractAddress = getContractAddress(ContractName.REPUTATION_BADGE, provider)
    const contractInstance = await getBackendContractInstance(ContractName.REPUTATION_BADGE, contractAddress)

    return contractInstance.exists(tokenId)
}
