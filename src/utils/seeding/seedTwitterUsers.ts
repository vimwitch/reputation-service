import { ReputationLevel } from "@interrep/reputation-criteria"
import colors from "colors"
import Web2Account from "src/models/web2Accounts/Web2Account.model"
import { Web2Providers } from "src/models/web2Accounts/Web2Account.types"
import { getTwitterFriendsByUserId, getTwitterUserByUsername } from "src/services/twitter"
import { TwitterUser } from "src/types/twitter"

function createTwitterSeedUser(user: TwitterUser): any {
    return new Web2Account({
        provider: Web2Providers.TWITTER,
        uniqueKey: `${Web2Providers.TWITTER}:${user.id}`,
        createdAt: Date.now(),
        providerAccountId: user.id,
        isSeedUser: true,
        isLinkedToAddress: false,
        basicReputation: ReputationLevel.GOLD
    })
}

export default async function seedTwitterUsers(twitterUsernames: string[], logger = false): Promise<void> {
    const log = logger ? console.log : (message: string) => message

    log(colors.white.bold("\nSeeding Twitter accounts...\n"))

    for (const username of twitterUsernames) {
        const twitterUser = await getTwitterUserByUsername({
            username
        })
        const friends = await getTwitterFriendsByUserId({
            userId: twitterUser.id,
            maxResults: 900
        })

        log(colors.white(`${username} has ${friends.length} friends`))

        if (friends.length === 0) {
            break
        }

        const formattedFriends = friends.map((friend) => createTwitterSeedUser(friend))

        try {
            // With ordered false, it inserts all documents it can and report
            // errors at the end (incl. errors from duplicates).
            const docs = await Web2Account.insertMany(formattedFriends, {
                ordered: false
            })

            log(colors.green.bold(`${docs.length} ${username}'s friends inserted ✓`))
        } catch (error: any) {
            log(colors.white(`${error.result?.nInserted} documents have been inserted`))
            log(colors.white(`Number of write errors: ${error.writeErrors?.length}`))
        }

        log("\n")
    }
}
