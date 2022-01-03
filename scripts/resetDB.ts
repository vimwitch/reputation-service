import { dbClear, dbConnect, dbDisconnect } from "src/utils/backend/database"
import { seedZeroHashes } from "src/utils/backend/seeding"

async function main() {
    await dbConnect()
    await dbClear()

    await seedZeroHashes()

    await dbDisconnect()
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
