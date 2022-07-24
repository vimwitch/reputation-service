import { OAuthProvider } from "@interep/reputation"
import { Provider } from "./types/groups"
import { NetworkData } from "./types/network"

const defaultEnv = {
    CRON_INTERVAL: 1, // Minutes.
    API_WHITELIST: [
        /^http:\/\/localhost/,
        /^http:\/\/127.0.0.1/,
        /^https:\/\/kovan\.interep\.link/,
        /^https:\/\/goerli\.interep\.link/,
        /^https:\/\/auti\.sm/,
        /^https:\/\/www\.auti\.sm/,
        /^https:\/\/vercel\.app/,
        /^https:\/\/[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.varcel\.app/
    ]
}

export const merkleTreeDepths: Record<Provider, number> = {
    [OAuthProvider.TWITTER]: 20,
    [OAuthProvider.REDDIT]: 20,
    [OAuthProvider.GITHUB]: 20,
    telegram: 20,
    email: 20,
    poap: 20
}

export enum Environment {
    TEST = "test",
    DEVELOPMENT = "development",
    PRODUCTION = "production"
}

export enum ContractName {
    INTEREP = "Interep"
}

export enum SupportedChainId {
    LOCALHOST = 31337,
    GOERLI = 5,
    KOVAN = 42,
    ARBITRUM = 42161,
    OPTIMISM = 420
}

export const contractAddresses: Record<SupportedChainId, Record<ContractName, any>> = {
    [SupportedChainId.LOCALHOST]: {
        [ContractName.INTEREP]: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
    },
    [SupportedChainId.GOERLI]: {
        [ContractName.INTEREP]: "0x9f44be9F69aF1e049dCeCDb2d9296f36C49Ceafb"
    },
    [SupportedChainId.KOVAN]: {
        [ContractName.INTEREP]: "0xF58D3b710cDD337df432e20a806Ad04f6CfE53De"
    },
    [SupportedChainId.ARBITRUM]: {
        [ContractName.INTEREP]: "0xa2A7f256B4Ea653eef95965D09bbdBb4b4526419"
    },
    [SupportedChainId.OPTIMISM]: {
      [ContractName.INTEREP]: "0x8d4fCA685f46E8579b8Ad968822b50D91f412052"
    }
}

export const supportedNetworks: Record<string, NetworkData> = {
    localhost: {
        name: "localhost",
        chainId: SupportedChainId.LOCALHOST
    },
    goerli: {
        name: "goerli",
        chainId: SupportedChainId.GOERLI
    },
    kovan: {
        name: "kovan",
        chainId: SupportedChainId.KOVAN
    },
    arbitrum: {
        name: "arbitrum",
        chainId: SupportedChainId.ARBITRUM
    },
    optimism: {
      name: "optimism",
      chainId: SupportedChainId.OPTIMISM
    },
    defaultNetwork: {
      name: "optimism",
      chainId: SupportedChainId.OPTIMISM
    }
}

export const currentNetwork: NetworkData = (function IIFE(): NetworkData {
  return supportedNetworks.optimism
})()

export default {
    MONGO_URL: process.env.MONGO_URL,
    TWITTER_CONSUMER_KEY: process.env.TWITTER_CONSUMER_KEY,
    TWITTER_CONSUMER_SECRET: process.env.TWITTER_CONSUMER_SECRET,
    TWITTER_ACCESS_TOKEN: process.env.TWITTER_ACCESS_TOKEN,
    TWITTER_ACCESS_TOKEN_SECRET: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    REDDIT_CLIENT_ID: process.env.REDDIT_CLIENT_ID,
    REDDIT_CLIENT_SECRET: process.env.REDDIT_CLIENT_SECRET,
    GMAIL_ADDRESS: process.env.GMAIL_ADDRESS,
    GMAIL_CLIENT_ID: process.env.GMAIL_CLIENT_ID,
    GMAIL_CLIENT_SECRET: process.env.GMAIL_CLIENT_SECRET,
    GMAIL_REFRESH_TOKEN: process.env.GMAIL_REFRESH_TOKEN,
    GMAIL_ACCESS_TOKEN: process.env.GMAIL_ACCESS_TOKEN,
    RAPIDAPI_KEY: process.env.RAPIDAPI_KEY,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    JWT_SIGNING_PRIVATE_KEY: process.env.JWT_SIGNING_PRIVATE_KEY,
    JWT_SECRET: process.env.JWT_SECRET,
    CRON_INTERVAL: defaultEnv.CRON_INTERVAL,
    API_WHITELIST: defaultEnv.API_WHITELIST
}
