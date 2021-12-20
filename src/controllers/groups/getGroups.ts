import { NextApiRequest, NextApiResponse } from "next"
import { getGroups } from "src/core/groups"
import { dbConnect } from "src/utils/backend/database"
import logger from "src/utils/backend/logger"

export default async function getGroupsController(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        res.status(405).end()
        return
    }

    try {
        await dbConnect()

        const groups = await getGroups()

        res.status(200).send({ data: groups })
    } catch (error) {
        res.status(500).end()

        logger.error(error)
    }
}
